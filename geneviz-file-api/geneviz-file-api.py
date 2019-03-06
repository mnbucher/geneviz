from flask import Flask, request
import tempfile
import base64
import zipfile
import json

app = Flask(__name__)


# Temporary storage for all VNF Packages.
# The location of the temp folder heavily depends on the operating system.
storage = tempfile.mkdtemp(prefix="geneviz_")


@app.route('/vnf', methods=['POST'])
def storeVNF():
    """ Create a new .ZIP file with the content of the VNF Package passed as a string in Base64 encoding """

    content = request.get_json()
    uuid = content['uuid']
    vnf_file = base64.b64decode(content['fileBase64'])
    print(storage)
    try:
        with open(storage + '/' + uuid + '.zip', "xb") as f:
            f.write(vnf_file)
            return 'VNF was stored successfully'
    except FileExistsError:
        return 'Could not store VNF'


@app.route('/vnf/<uuid>/<vnf_name>', methods=['GET'])
def getVNFD(uuid, vnf_name):
    """ Get the VNF Descriptor of a certain VNF Package """

    try:
        with zipfile.ZipFile(getZipFilePath(uuid), 'r') as archive:
            with archive.open(vnf_name + '/Descriptors/vnfd.json') as vnfd:
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
    path = vnf_name + '/Descriptors/vnfd.json'

    try:
        with zipfile.ZipFile(getZipFilePath(uuid), 'a') as archive:
            with archive.open(path, 'w') as vnfd:
                vnfd.write(new_vnfd_json.encode())
                vnfd.close()
                archive.close()

                # Q1: Maybe we should also try to change the modification date on the file with utime(), but does it also work on Windows?
                # Q2: Try this also in Windows, maybe we have two VNFD.json files in the same folder --> Create new ZIP would be necessary

                return 'VNF Descriptor was updated successfully'
    except Exception as e:
        print(e)
        return 'The VNF Descriptor could not be updated'

@app.route('/')


def getZipFilePath(uuid):
    return storage + '/' + uuid + '.zip'
