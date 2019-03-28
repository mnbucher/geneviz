# coding: utf-8 

from flask import Flask, request, send_file
from flask_cors import CORS
import tempfile
import base64
import zipfile
import json
import os
from uuid import uuid1

# GENEVIZ FILE API
# Version 1.0
#
# 25.03.2019
# Author: Martin Juan José Bucher
# Bachelor Thesis @ University of Zurich

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

# Temporary storage for all VNF Packages.
# The location of the temp folder heavily depends on the operating system.
STORAGE = tempfile.mkdtemp(prefix="geneviz_")
print("Storage Location: " + STORAGE)

# Global variables
VENDOR = "UZH"


@app.route('/vnf', methods=['POST'])
def storeVNF():
    """ Create a new .ZIP file with the content of the VNF Package passed as a string in Base64 encoding """

    content = request.get_json()
    uuid = content['uuid']
    vnf_name = content['vnf_name']
    vnf_file = base64.b64decode(content['file_base_64'])

    try:
        if not os.path.isfile(get_zip_file_path(vnf_name)):
            with open(get_zip_file_path(vnf_name), "xb") as f:
                f.write(vnf_file)
        with zipfile.ZipFile(get_zip_file_path(vnf_name), 'a') as archive:
            with archive.open(get_vnfd_parent_path(vnf_name), 'r') as vnfd_parent:
                vnfd_parent_content = json.loads(
                    vnfd_parent.read().decode("utf-8"))
                vnfd_parent_content['vnfd']['id'] = uuid
            archive.writestr(get_vnfd_path(uuid, vnf_name),
                             json.dumps(vnfd_parent_content, indent=4))
            return json.dumps({"success": True}), 200, {'ContentType': 'application/json'}
    except FileExistsError:
        return json.dumps({
            "success": False,
            "message": "The File already exists and could not be stored"
        }), 400, {'ContentType': 'application/json'}


@app.route('/vnf/<uuid>/<vnf_name>', methods=['GET'])
def getVNFD(uuid, vnf_name):
    """ Get the VNF Descriptor of a certain VNF Package """

    try:
        with zipfile.ZipFile(get_zip_file_path(uuid), 'r') as archive:
            with archive.open(get_vnfd_path(uuid, vnf_name)) as vnfd:
                vnfd_json = json.loads(vnfd.read().decode("utf-8"))
                return json.dumps(vnfd_json)
    except Exception as e:
        print(e)
        return 'The VNF with the requested UUID does not exist or could not be returned'


@app.route('/vnf/<uuid>/<vnf_name>', methods=['PUT'])
def updateVNFD(uuid, vnf_name):
    """ Update the VNF Descriptor of a certain VNF Package """

    new_vnfd_json = json.dumps(request.get_json(), indent=4)

    try:
        with zipfile.ZipFile(get_zip_file_path(uuid), 'a') as archive:
            with archive.open(get_vnfd_path(uuid, vnf_name), 'w') as vnfd:
                vnfd.write(new_vnfd_json.encode())

                # Q1: Maybe we should also try to change the modification date on the file with utime(), but does it also work on Windows?
                # Q2: Try this also in Windows and Unix, maybe we have two VNFD.json files in the same folder --> Create new ZIP would be necessary

                return json.dumps({"success": True}), 200, {'ContentType': 'application/json'}
    except Exception as e:
        print(e)
        return json.dumps({"success": False}), 500, {'ContentType': 'application/json'}


@app.route('/sfc', methods=['POST'])
def createSFC():
    """ Create a new SFC package based on the UUIDs (i.e. VNF Packages) passed by in the body """

    content = request.get_json()
    vnf_packages = content['vnf_packages']
    sfc_package_name = "sfc-" + str(uuid1())

    try:
        with zipfile.ZipFile(get_zip_file_path(sfc_package_name), 'w') as sfcPackage:
            vnfds = []

            for vnf_name, uuids in vnf_packages.items():

                # Get path names of each VNFD for the NSD
                for uuid in uuids:
                    vnfds.append(get_vnfd_path(vnf_name, uuid))

                # Store each VNF Package inside the SFC Package
                with zipfile.ZipFile(get_zip_file_path(vnf_name), 'r') as vnfPackageZip:
                    file_list = [(file_name, vnfPackageZip.read(file_name))
                                 for file_name in vnfPackageZip.namelist()]
                    for file in file_list:
                        # Only consider those VNFDs which are included in the UUID list provided
                        if '/Descriptors/vnfd' in file[0]:
                            if '/Descriptors/vnfd.json' not in file[0]:
                                uuid = (file[0].split(
                                    '/Descriptors/vnfd-'))[1].split('.')[0]
                                if uuid in uuids:
                                    sfcPackage.writestr(file[0], file[1])
                        else:
                            sfcPackage.writestr(file[0], file[1])

            # Generate NSD based on the VNF Packages
            nsd = {
                "name": content['nsd_name'],
                "vendor": VENDOR,
                "version": "1.0",
                "vnfd": vnfds,
                "vld": [{"name": "private"}],
                "vnf_dependency": [{
                    "source": {
                        "name": "firewall-1.0-uzh"
                    },
                    "target": {
                        "name": "dns-1.0-uzh"
                    },
                    "parameters": [
                        "private"
                    ]}
                ]
            }

            sfcPackage.writestr('nsd.json', json.dumps(nsd, indent=4).encode())

            # Generate VNFFGD based on the provided Graph and the VNF Packages
            vnffgd = {

            }

            sfcPackage.writestr('vnffgd.json', json.dumps(nsd, indent=4).encode())

        return send_file(get_zip_file_path(sfc_package_name),
                         mimetype='application/zip',
                         attachment_filename='sfc-' + sfc_package_name + '.zip',
                         as_attachment=True)
    except Exception as e:
        print(e)
        return json.dumps({"success": False}), 500, {'ContentType': 'application/json'}


def get_zip_file_path(file_name):
    return STORAGE + '/' + file_name + '.zip'


def get_vnfd_parent_path(vnf_name):
    return vnf_name + '/Descriptors/vnfd.json'


def get_vnfd_path(uuid, vnf_name):
    return vnf_name + '/Descriptors/vnfd-' + uuid + '.json'
