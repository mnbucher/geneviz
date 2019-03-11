from flask import Flask, request, send_file
from flask_cors import CORS
import tempfile
import base64
import zipfile
import json
from uuid import uuid1

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

# Temporary storage for all VNF Packages.
# The location of the temp folder heavily depends on the operating system.
storage = tempfile.mkdtemp(prefix="geneviz_")
print("Storage Location: " + storage)


@app.route('/vnf', methods=['POST'])
def storeVNF():
    """ Create a new .ZIP file with the content of the VNF Package passed as a string in Base64 encoding """

    content = request.get_json()
    uuid = content['uuid']
    vnf_file = base64.b64decode(content['fileBase64'])
    try:
        with open(storage + '/' + uuid + '.zip', "xb") as f:
            f.write(vnf_file)
            return json.dumps({"success": True}), 200, {'ContentType': 'application/json'}
    except FileExistsError:
        return json.dumps({"success": False}), 500, {'ContentType': 'application/json'}


@app.route('/vnf/<uuid>/<vnf_name>', methods=['GET'])
def getVNFD(uuid, vnf_name):
    """ Get the VNF Descriptor of a certain VNF Package """

    try:
        with zipfile.ZipFile(get_zip_file_path(uuid), 'r') as archive:
            with archive.open(get_vnfd_path(vnf_name)) as vnfd:
                vnfd_json = json.loads(vnfd.read().decode("utf-8"))
                archive.close()
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
            with archive.open(get_vnfd_path(vnf_name), 'w') as vnfd:
                vnfd.write(new_vnfd_json.encode())
                vnfd.close()
                archive.close()

                # Q1: Maybe we should also try to change the modification date on the file with utime(), but does it also work on Windows?
                # Q2: Try this also in Windows, maybe we have two VNFD.json files in the same folder --> Create new ZIP would be necessary

                return 'VNF Descriptor was updated successfully'
    except Exception as e:
        print(e)
        return 'The VNF Descriptor could not be updated'


@app.route('/sfc', methods=['POST'])
def createSFC():
    """ Create a new SFC package based on the UUIDs (i.e. VNF Packages) passed by in the body """

    uuids = request.args.getlist('uuids[]')
    sfc_package_name = str(uuid1())

    try:
        with zipfile.ZipFile(get_zip_file_path(sfc_package_name), 'w') as sfcPackage:
            for uuid in uuids:
                with zipfile.ZipFile(get_zip_file_path(uuid), 'r') as vnfPackageZip:
                    file_list = [(s, vnfPackageZip.read(s)) for s in vnfPackageZip.namelist()]
                    for file in file_list:
                        sfcPackage.writestr(file[0], file[1])
                    vnfPackageZip.close()
        sfcPackage.close()
        return send_file(get_zip_file_path(sfc_package_name),
                         mimetype='application/zip',
                         attachment_filename='sfc-package-' + sfc_package_name + '.zip',
                         as_attachment=True)
    except Exception as e:
        print(e)
        return json.dumps({"success": False}), 500, {'ContentType': 'application/json'}


def get_zip_file_path(uuid):
    return storage + '/' + uuid + '.zip'


def get_vnfd_path(vnf_name):
    return vnf_name + '/Descriptors/vnfd.json'
