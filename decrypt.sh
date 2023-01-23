#!/bin/bash

if [ $# -ne 1 ]; then
	echo "Usage:"
	echo "$0 <file-to-decrypt>"
	exit 1
fi

which gpg &>/dev/null
if [ $? -ne 0 ]; then
	echo "GnuPG is not installed."
	echo "Please install GnuPG with 'brew install gnupg' or use the Managed Software Center."
	exit 1
fi

gpg --list-keys | grep "trancedance"
if [ $? -ne 0 ]; then
	gpg --import ./misc/private_key.gpg
	gpg --import ./misc/public_key.gpg
	if [ $? -ne 0 ]; then
		echo "Couldn't import GnuPG keys."
		exit 1
	fi
fi

gpg --decrypt --output .env "$1"
RET=$?
if [ $RET -ne 0 ]; then
	echo "Something went wrong..."
	echo "GnuPG exited with code: $RET"
	exit $RET
fi

echo "File was successfully decrypted!"
ln -f .env backend/.env
ln -f .env frontend/.env
