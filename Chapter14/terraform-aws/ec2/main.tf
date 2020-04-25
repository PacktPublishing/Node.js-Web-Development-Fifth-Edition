provider "aws" {
    profile  = "notes-app"
    region   = data.terraform_remote_state.vpc.outputs.aws_region
}

terraform {
  backend "local" {
    path = "../state/ec2/terraform.tfstate"
  }
}

data "terraform_remote_state" "vpc" {
  backend = "local"
  config = {
    path = "../state/vpc/terraform.tfstate"
  }
}

module "ec2" {
    source = "../modules/ec2"
    name   = "notes-ec2"
    vpc_id = data.terraform_remote_state.vpc.outputs.vpc_id
    igw_id = data.terraform_remote_state.vpc.outputs.igw_id
    subnet_id = data.terraform_remote_state.vpc.outputs.subnet_public1_id
    instance_type = "t2.micro"
    key_pair = "notes-app-key-pair"

    user_data = <<EOF
#!/bin/sh
sudo apt-get update
sudo apt-get install -y mysql-client
EOF
}

output "ec2-public-dns" { value = module.ec2.ec2-public-dns }
output "ec2-public-ip"  { value = module.ec2.ec2-public-ip }