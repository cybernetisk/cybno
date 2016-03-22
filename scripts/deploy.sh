#!/bin/bash

# generating new key:
# $ ssh-keygen -t rsa -b 4096 -C "cybno@travis" -f travis-key-cybno -N ''
# $ travis encrypt-file travis-key-cybno
# references: http://docs.travis-ci.com/user/encrypting-files/

# set working directory to the directory of this script
cd "$(dirname "$0")"

# exit on errors
set -e

if [ ! -z "$TRAVIS" ]; then
  echo "Decrypting ssh-key and adding"
  openssl aes-256-cbc -K $encrypted_8c393341f536_key -iv $encrypted_8c393341f536_iv -in travis-key-cybno.enc -out travis-key-cybno -d
  chmod 600 travis-key-cybno
  eval "$(ssh-agent)"
  ssh-add travis-key-cybno
fi

cd ..

npm run build

echo "Deploying new files"

rsync -arv --delete -e "ssh -o StrictHostKeyChecking=no" public/ cyb@login.ifi.uio.no:www_docs/2016/

ssh -o StrictHostKeyChecking=no cyb@login.ifi.uio.no /bin/bash <<EOF
  set -e
  cd www_docs/2016/
  chmod a+r . -R
EOF

echo "Deploy finished"
