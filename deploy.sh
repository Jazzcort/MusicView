rm -rf musicview.zip

npm run build && \
zip -r musicview.zip ./build
if [ $? -ne 0 ]; then
	echo "Build failed. Exiting script."
	exit 1
fi

ec2_instance="ec2-user@ec2-54-196-149-224.compute-1.amazonaws.com"
key_file="~/jazzcort.com/jazzcort.pem"

scp -i $key_file ./musicview.zip  ${ec2_instance}:~/domain-server && \
ssh -i $key_file $ec2_instance << 'ENDSSH'
rm -rf ./domain-server/musicview && \
unzip -o ./domain-server/musicview.zip -d ./domain-server && \
mv ./domain-server/build ./domain-server/musicview && \
rm ./domain-server/musicview.zip
ENDSSH
