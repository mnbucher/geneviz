from web3 import Web3, HTTPProvider

class EthAPI():
    ENDPOINT_URI = 'HTTP://127.0.0.1:7545'
    web3 = Web3(HTTPProvider(ENDPOINT_URI))
    client = web3.eth

    @classmethod
    def store(cls, text, address, privkey):
        # start = int(round(time.time() * 1000))  # Milliseconds
        if not Web3.isChecksumAddress(address):
            address = Web3.toChecksumAddress(address)
        transaction = cls.create_transaction(text,address)
        signed_transaction = cls.sign_transaction(transaction,privkey)
        transaction_hash = cls.send_raw_transaction(signed_transaction)
        return transaction_hash

    # ---STORE---
    @classmethod
    def create_transaction(cls, text, address):
        transaction = {
            'from': address,
            'to': address,
            'gasPrice': cls.client.gasPrice,
            'value': 0,
            'data': bytes(text, 'utf-8'),
            'nonce': cls.get_transaction_count(address)
        }
        transaction['gas'] = cls.estimate_gas(transaction)
        return transaction

    @classmethod
    def get_transaction_count(cls,address):
        return cls.client.getTransactionCount(address)

    @classmethod
    def estimate_gas(cls, transaction):
        return cls.client.estimateGas(transaction)

    @classmethod
    def sign_transaction(cls, transaction, privkey):
        signed = cls.client.account.signTransaction(transaction, privkey)
        return signed.rawTransaction

    @classmethod
    def send_raw_transaction(cls, transaction):
        transaction_hash = cls.client.sendRawTransaction(transaction)
        return transaction_hash.hex()

    # ---RETRIEVE---

    @classmethod
    def retrieve(cls, txhash):
        tx = cls.get_transaction(txhash)
        packageHash = cls.extract_data(tx)
        return cls.to_text(packageHash)


    @classmethod
    def get_transaction(cls, transaction_hash):
        return cls.client.getTransaction(transaction_hash)

    @staticmethod
    def extract_data(transaction):
        # print(transaction)
        # Note that 'input' might be replaced with 'data' in a future release,
        # see here for more detailed information:
        # https://github.com/ethereum/web3.py/issues/901
        return transaction.input

    @staticmethod
    def to_text(data):
        return Web3.toText(data)
