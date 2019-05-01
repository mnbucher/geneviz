# coding: utf-8

from flask import Flask, request, send_file
from flask_cors import CORS
import tempfile
import base64
import zipfile
import json
import os
from uuid import uuid1
from hashlib import md5
from ethereum_api import EthereumAPI

# GENEVIZ MANAGEMENT API 
# (Data Layer of GENEVIZ Conceptual Architecture)
#
# Version 1.0
#
# Date: 25.03.2019
# Author: Martin Juan José Bucher
# Bachelor Thesis @ University of Zurich

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

# Temporary storage for all VNF Packages.
# The location of the temp folder heavily depends on the operating system.
STORAGE = tempfile.mkdtemp(prefix="geneviz_")
print("\n Storage Location:\n " + STORAGE + "\n")


# Create a new .ZIP file with the content of the VNF Package passed as a string in Base64 encoding
@app.route('/vnf', methods=['POST'])
def storeVNF():
    content = request.get_json()
    uuid = content['uuid']
    vnf_name = content['vnfName']
    vnf_file = base64.b64decode(content['fileBase64'])

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
            return json.dumps({
                "success": True
            }), 200, {'ContentType': 'application/json'}
    except Exception as e:
        print(e)
        return json.dumps({
            "success": False,
            "message": "The VNF Package could not be stored"
        }), 500, {'ContentType': 'application/json'}


# Get the VNF Descriptor of a certain VNF Package
@app.route('/vnf/<uuid>/<vnf_name>', methods=['GET'])
def getVNFD(uuid, vnf_name):
    try:
        with zipfile.ZipFile(get_absolute_zip_file_path(vnf_name), 'r') as archive:
            with archive.open(get_vnfd_path(uuid, vnf_name)) as vnfd:
                vnfd_json = json.loads(vnfd.read().decode("utf-8"))
                return json.dumps({
                    "success": True, 
                    "vnfd": vnfd_json
                }), 200, {'ContentType': 'application/json'}
    except Exception as e:
        print(e)
        return json.dumps({
            "success": False,
            "message": "The VNF with the requested UUID does not exist or could not be returned"
        }), 400, {'ContentType': 'application/json'}


# Update the VNF Descriptor of a certain VNF Package
@app.route('/vnf/<uuid>/<vnf_name>', methods=['PUT'])
def updateVNFD(uuid, vnf_name):
    new_vnfd_json = json.dumps(request.get_json(), indent=4)

    try:
        with zipfile.ZipFile(get_absolute_zip_file_path(vnf_name), 'a') as archive:
            with archive.open(get_vnfd_path(uuid, vnf_name), 'w') as vnfd:
                vnfd.write(new_vnfd_json.encode())

                # Q1: Maybe we should also try to change the modification date on the file with utime(), but does it also work on Windows?
                # Q2: Try this also in Windows and Unix, maybe we have two VNFD.json files in the same folder --> Create new ZIP would be necessary

                return json.dumps({
                    "success": True
                }), 200, {'ContentType': 'application/json'}
    except Exception as e:
        print(e)
        return json.dumps({
            "success": False
        }), 400, {'ContentType': 'application/json'}


# Import SFC in order to modify it through the Service Construction Visualziation
@app.route('/sfc', methods=['POST'])
def importSFC():
    content = request.get_json()
    sfc_uuid = str(uuid1())
    sfc_name = "sfc-" + sfc_uuid
    sfc_wrapper_name = "sfc-wrapper-" + sfc_uuid
    sfc_wrapper_file = base64.b64decode(content)

    try:
        with open(get_absolute_zip_file_path(sfc_wrapper_name), "xb") as f_wrapper:
                f_wrapper.write(sfc_wrapper_file)
        with zipfile.ZipFile(get_absolute_zip_file_path(sfc_wrapper_name), 'r') as sfc_wrapper_archive:
            with sfc_wrapper_archive.open('sfc.zip', 'r') as sfc:
                sfc_data = sfc.read()
                with open(get_absolute_zip_file_path(sfc_name), "xb") as f:
                    f.write(sfc_data)
        with zipfile.ZipFile(get_absolute_zip_file_path(sfc_name), 'r') as sfc_archive:
            files = [(file_name, sfc_archive.read(file_name))
                            for file_name in sfc_archive.namelist()]
            
            # Get folder names of VNFs inside the SFC Package
            vnf_names = []
            for file in files:
                if(file[0].count("/") is 1 and "__MACOSX/" not in file[0] and file[0] is not "" and file[0] not in vnf_names):
                    vnf_names.append(file[0].split('/')[0])

            # Extract VNF Packages from SFC Package and store in new .zip file
            vnfs = []
            nsd = {}
            for vnf_name in vnf_names:
                with zipfile.ZipFile(get_absolute_zip_file_path(vnf_name), 'a') as vnf_archive:
                    for file in files:
                        if(file[0].find(vnf_name) is 0):
                            vnf_archive.writestr(file[0], file[1])
                            if '/Descriptors/vnfd-' in file[0]:
                                uuid = (file[0].split('/Descriptors/vnfd-'))[1].split('.')[0]
                                vnf = {
                                    "name": vnf_name,
                                    "uuid": uuid,
                                    "vnfd": json.loads(file[1].decode("utf-8"))
                                }
                                vnfs.append(vnf)
                        if 'nsd.json' in file[0]:
                            nsd = json.loads(file[1].decode("utf-8"))
        return json.dumps({
            "success": True,
            "vnfs": vnfs,
            "order": nsd['vnfd']
        }), 200, {'ContentType': 'application/json'}
    except Exception as e:
        print(e)
        return json.dumps({
            "success": False,
            "message": "The SFC could not be imported"
        }), 400, {'ContentType': 'application/json'}

# Validate an existing SFC if the hash of the SFC Package was stored on the Ethereum Blockchain
@app.route('/sfc/validate', methods=['POST'])
def validateSFC():
    content = request.get_json()
    sfc_uuid = str(uuid1())
    sfc_wrapper_name = "sfc-wrapper-" + sfc_uuid
    sfc_wrapper_file = base64.b64decode(content)
    m = md5()

    try:
        with open(get_absolute_zip_file_path(sfc_wrapper_name), "xb") as f:
            f.write(sfc_wrapper_file)
            
        with zipfile.ZipFile(get_absolute_zip_file_path(sfc_wrapper_name)) as sfc_wrapper_archive:
            with sfc_wrapper_archive.open("sfc.zip", 'r') as sfc:
                sfc_data = sfc.read()
                m.update(sfc_data)
                with sfc_wrapper_archive.open("geneviz.json", 'r') as geneviz:
                        geneviz_content = json.loads(geneviz.read().decode("utf-8"))
                        if(geneviz_content['txHash'] != ""):
                            try:
                                sfcPackageHash = EthereumAPI.retrieve(geneviz_content['txHash'])
                            except Exception as e:
                                return json.dumps({
                                    "success": False
                                }), 404, {'ContentType': 'application/json'}
                            if m.hexdigest() == sfcPackageHash:
                                return json.dumps({
                                    "success": True
                                }), 200, {'ContentType': 'application/json'}
                            else:
                                return json.dumps({
                                    "success": False
                                }), 404, {'ContentType': 'application/json'}
                        else:
                            return json.dumps({
                                "success": False
                            }), 400, {'ContentType': 'application/json'}
    except Exception as e:
        print(e)
        return json.dumps({
            "success": False
        }), 500, {'ContentType': 'application/json'}

    

# Create a new SFC package based on the UUIDs (i.e. VNF Packages) passed by in the body
@app.route('/sfc/generate', methods=['POST'])
def createSFC():
    content = request.get_json()
    sfc_uuid = str(uuid1())
    sfc_name = "sfc-" + sfc_uuid
    sfc_wrapper_name = "sfc-wrapper-" + sfc_uuid
    m = md5()

    try:
        with zipfile.ZipFile(get_absolute_zip_file_path(sfc_name), 'w') as sfc:
            for vnf_name, uuids in content['vnfPackages'].items():
                # Store each VNF Package inside the SFC Package
                with zipfile.ZipFile(get_absolute_zip_file_path(vnf_name), 'r') as vnf_package_zip:
                    files = [(file_name, vnf_package_zip.read(file_name))
                                 for file_name in vnf_package_zip.namelist()]
                    for file in files:
                        # Only consider those VNFDs which are included in the UUID list provided
                        if '/Descriptors/vnfd' in file[0]:
                            if '/Descriptors/vnfd.json' not in file[0]:
                                uuid = (file[0].split(
                                    '/Descriptors/vnfd-'))[1].split('.')[0]
                                if uuid in uuids:
                                    sfc.writestr(file[0], file[1])
                        else:
                            sfc.writestr(file[0], file[1])

            # Get path names of each VNFD for the NSD
            vnfds = []
            for vnf in content['path']:
                vnfds.append(get_vnfd_path(vnf['uuid'], vnf['name']))

            # Generate NSD based on the VNF Packages
            nsd = {
                "name": content['nsd']['name'],
                "vendor": content['nsd']['vendor'],
                "version": content['nsd']['version'],
                "vnfd": vnfds,
                "vld": [{"name": "private"}],
            }
            sfc.writestr('nsd.json', json.dumps(nsd, indent=4).encode())

        with zipfile.ZipFile(get_absolute_zip_file_path(sfc_wrapper_name), 'w') as sfc_wrapper:
            with open(get_absolute_zip_file_path(sfc_name), 'rb') as sfc:
                sfc_data = sfc.read()
                sfc_wrapper.writestr('sfc.zip', sfc_data)

                # Store Hash of the SFC Package on the Ethereum Blockchain if wished
                m.update(sfc_data)
                txhash = EthereumAPI.store(m.hexdigest(), content['bc']['address'], content['bc']['privateKey']) if content['bc']['storeOnBC'] else ""
                geneviz = {
                    "txHash": txhash,
                    "address": content['bc']['address']
                }
                sfc_wrapper.writestr('geneviz.json', json.dumps(geneviz, indent=4).encode())
        
        return send_file(get_absolute_zip_file_path(sfc_wrapper_name),
                        mimetype='application/zip',
                        attachment_filename=sfc_wrapper_name + '.zip',
                        as_attachment=True)
    except Exception as e:
        print(e)
        return json.dumps({
            "success": False
        }), 400, {'ContentType': 'application/json'}


def get_absolute_zip_file_path(file_name):
    return STORAGE + '/' + file_name + '.zip'


def get_vnfd_parent_path(vnf_name):
    return vnf_name + '/Descriptors/vnfd.json'


def get_vnfd_path(uuid, vnf_name):
    return vnf_name + '/Descriptors/vnfd-' + uuid + '.json'