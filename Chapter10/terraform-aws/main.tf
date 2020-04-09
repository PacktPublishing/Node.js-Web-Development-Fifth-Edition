provider "aws" {
    // shared_credentials_file = "$HOME/.aws/credentials"
    profile                 = "notes-app"
    region                  = var.aws_region
}

module "db" {
    source = "./modules/rds"
    vpc_id = aws_vpc.notes.id
    vpc_cidr = var.vpc_cidr
    subnet_private1_id = aws_subnet.private1.id
    subnet_private2_id = aws_subnet.private2.id
}

module "ec2" {
    source = "./modules/ec2"
    name   = "notes-ec2"
    vpc_id = aws_vpc.notes.id
    igw_id = aws_internet_gateway.igw.id
    subnet_id = aws_subnet.public.id
    instance_type = "t2.micro"
    key_pair = "notes-app-key-pair"

    user_data = <<EOF
#!/bin/sh
sudo apt-get update
sudo apt-get install -y mysql-client
EOF
}

