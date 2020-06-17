
cat >/home/ubuntu/swarm-setup.sh <<EOF
#!/bin/sh

### Capture the file name for the PEM from the command line
PEM=\$1

join="`docker swarm join-token manager | sed 1,2d | sed 2d`"

%{ for instance in instances ~}
ssh -i \$PEM ${instance.dns} \$join
docker node update --label-add type=${instance.type} ${instance.name}
%{ endfor ~}

EOF
