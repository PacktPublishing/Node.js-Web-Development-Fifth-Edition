
NM=$1

multipass launch --name ${NM} focal
multipass transfer setup-instance.sh ${NM}:/home/ubuntu/setup-instance.sh
multipass exec ${NM} -- sh -x /home/ubuntu/setup-instance.sh
