# coding: utf-8

from flask import Flask, request, send_file
from flask_cors import CORS
import tempfile
import base64
import zipfile
import json
import os
from uuid import uuid1
import ethadapter

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
print("\n Storage Location:\n " + STORAGE + "\n")

@app.route('/storePackageHash/',methods=['GET'])
def storeBlockchain():
    address = "0xC1479f489948670bf85B07d9B56dc9c474C4228e"
    privkey = "99a8e59f28f533186c6daca32470a36905cc233ba41ff9279972c39228687ddb"
    txhash = ethadapter.EthAPI.store("test",address,privkey)

@app.route('/retrievePackageHash/',methods=['GET'])
def retrieveBlockchain():
    storedData = ethadapter.EthAPI.retrieve("0x70e676d32a70e55496c98d2390a0d42aec20414651d2bbf98ef8f1042af92f46")

@app.route('/vnf', methods=['POST'])
def storeVNF():
    """ Create a new .ZIP file with the content of the VNF Package passed as a string in Base64 encoding """

    content = request.get_json()
    uuid = content['uuid']
    vnf_name = content['vnf_name']
    vnf_file = base64.b64decode(content['file_base_64'])

    try:
        if not os.path.isfile(get_absolute_zip_file_path(vnf_name)):
            with open(get_absolute_zip_file_path(vnf_name), "xb") as f:
                f.write(vnf_file)
        with zipfile.ZipFile(get_absolute_zip_file_path(vnf_name), 'a') as archive:
            with archive.open(get_vnfd_parent_path(vnf_name), 'r') as vnfd_parent:
                vnfd_parent_content = json.loads(
                    vnfd_parent.read().decode("utf-8"))
                vnfd_parent_content['vnfd']['id'] = uuid
            archive.writestr(get_vnfd_path(uuid, vnf_name),
                             json.dumps(vnfd_parent_content, indent=4))
            return json.dumps({"success": True}), 200, {'ContentType': 'application/json'}
    except Exception as e:
        print(e)
        return json.dumps({
            "success": False,
            "message": "The File already exists or could not be stored"
        }), 400, {'ContentType': 'application/json'}


@app.route('/vnf/<uuid>/<vnf_name>', methods=['GET'])
def getVNFD(uuid, vnf_name):
    """ Get the VNF Descriptor of a certain VNF Package """

    try:
        with zipfile.ZipFile(get_absolute_zip_file_path(vnf_name), 'r') as archive:
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
        with zipfile.ZipFile(get_absolute_zip_file_path(vnf_name), 'a') as archive:
            with archive.open(get_vnfd_path(uuid, vnf_name), 'w') as vnfd:
                vnfd.write(new_vnfd_json.encode())

                # Q1: Maybe we should also try to change the modification date on the file with utime(), but does it also work on Windows?
                # Q2: Try this also in Windows and Unix, maybe we have two VNFD.json files in the same folder --> Create new ZIP would be necessary

                return json.dumps({"success": True}), 200, {'ContentType': 'application/json'}
    except Exception as e:
        print(e)
        return json.dumps({"success": False}), 500, {'ContentType': 'application/json'}


@app.route('/sfc', methods=['POST'])
def importSFC():
    """ Import SFC in order to modify it through the Service Construction Visualziation """
    
    content = request.get_json()
    sfc_file = base64.b64decode(content)
    sfc_uuid = str(uuid1())

    try:
        with open(get_absolute_zip_file_path("sfc-" + sfc_uuid), "xb") as f:
                f.write(sfc_file)   
        with zipfile.ZipFile(get_absolute_zip_file_path("sfc-" + sfc_uuid), 'r') as sfc_archive:

            
            file_list = [(file_name, sfc_archive.read(file_name))
                            for file_name in sfc_archive.namelist()]
            
            # Get folder names of VNFs inside the SFC Package
            vnf_list = []
            for file in file_list:
                if(file[0].count("/") is 3 and "sfc-package/sfc/" in file[0] and "__MACOSX/" not in file[0] and file[0] is not "" and file[0] not in vnf_list):
                    vnf_list.append(file[0])

            # Extract VNF Packages from SFC Package and store in new .zip file        
            for vnf in vnf_list:
                vnf_uuid = str(uuid1())
                with zipfile.ZipFile(get_absolute_zip_file_path(vnf_uuid), 'a') as vnf_archive:
                    for file in file_list:
                        if(file[0].find(vnf) is 0):
                            vnf_archive.writestr(file[0].split("/sfc/")[1], file[1])

            #with archive.open(get_vnfd_parent_path(vnf_name), 'r') as vnfd_parent:

        return json.dumps({"success": True}), 200, {'ContentType': 'application/json'}
    except Exception as e:
        return json.dumps({
            "success": False,
            "message": "The SFC could not be imported"
        }), 400, {'ContentType': 'application/json'}


@app.route('/sfc', methods=['GET'])
def createSFC():
    """ Create a new SFC package based on the UUIDs (i.e. VNF Packages) passed by in the body """

    content = request.get_json()
    vnf_packages = content['vnf_packages']
    nsd_properties = content['nsd_properties']
    path = content['path']
    sfc_package_name = "sfc-" + str(uuid1())

    try:
        with zipfile.ZipFile(get_absolute_zip_file_path(sfc_package_name), 'w') as sfcPackage:
            for vnf_name, uuids in vnf_packages.items():
                # Store each VNF Package inside the SFC Package
                with zipfile.ZipFile(get_absolute_zip_file_path(vnf_name), 'r') as vnfPackageZip:
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

            # Get path names of each VNFD for the NSD
            vnfds = []
            for vnf in path:
                vnfds.append(get_vnfd_path(vnf['uuid'], vnf['name']))

            # Generate NSD based on the VNF Packages
            nsd = {
                "name": nsd_properties['name'],
                "vendor": nsd_properties['vendor'],
                "version": nsd_properties['version'],
                "vnfd": vnfds,
                "vld": [{"name": "private"}],
            }
            sfcPackage.writestr('nsd.json', json.dumps(nsd, indent=4).encode())

        return send_file(get_absolute_zip_file_path(sfc_package_name),
                         mimetype='application/zip',
                         attachment_filename='sfc-' + sfc_package_name + '.zip',
                         as_attachment=True)
    except Exception as e:
        print(e)
        return json.dumps({"success": False}), 500, {'ContentType': 'application/json'}


def get_absolute_zip_file_path(file_name):
    return STORAGE + '/' + file_name + '.zip'


def get_vnfd_parent_path(vnf_name):
    return vnf_name + '/Descriptors/vnfd.json'


def get_vnfd_path(uuid, vnf_name):
    return vnf_name + '/Descriptors/vnfd-' + uuid + '.json'