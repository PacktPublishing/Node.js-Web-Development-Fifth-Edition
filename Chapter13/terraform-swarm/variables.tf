variable "aws_region" { default = "us-west-2" }

variable "enable_dns_support"   { default = true }
variable "enable_dns_hostnames" { default = true }

variable "project_name"  { default = "notes" }
// Variables may not be used here.
variable "vpc_name"      { default = "notes-vpc"   }

variable "vpc_cidr"      { default = "10.0.0.0/16" }
variable "public1_cidr"  { default = "10.0.1.0/24" }
variable "public2_cidr"  { default = "10.0.2.0/24" }
variable "private1_cidr" { default = "10.0.3.0/24" }
variable "private2_cidr" { default = "10.0.4.0/24" }

variable "ami_id" {
    // Ubuntu Server 18.04 LTS (HVM), SSD Volume Type - in us-west-2 
    // default = "ami-0d1cd67c26f5fca19"
    // Ubuntu Server 20.04 LTS (HVM), SSD Volume Type - in us-west-2
    default = "ami-09dd2e08d601bff67"
}

variable "instance_type" {
    default = "t2.micro"
}

variable "key_pair" {
    default = "notes-app-key-pair"
}

/* variable "vpc_id" {}
variable "igw_id" {}
variable "instance_type" {}
variable "subnet_id" {}
variable "name" {}
variable "key_pair" {}
variable "user_data" {} */