import zipfile
import json
from io import BytesIO

with zipfile.ZipFile('/Users/mnbucher/Downloads/sfc-package-other.zip', 'a') as sfc_wrapper_archive:
    with sfc_wrapper_archive.open('geneviz.json') as nsd:
        nsd_data = json.loads(nsd.read().decode("utf-8"))
        nsd_data['txHash'] = '0x1dFb65B436194C0cc195084CF7a25EafAcE26ED3'
        sfc_wrapper_archive.writestr('geneviz.json', json.dumps(nsd_data, indent=4))
