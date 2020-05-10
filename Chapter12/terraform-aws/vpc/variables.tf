variable "aws_region" { default = "us-west-2" }

variable "enable_dns_support"   { default = true }
variable "enable_dns_hostnames" { default = true }

variable "vpc_name"      { default = "notes-vpc"   }

variable "vpc_cidr"      { default = "10.0.0.0/16" }
variable "public1_cidr"  { default = "10.0.1.0/24" }
variable "public2_cidr"  { default = "10.0.2.0/24" }
variable "private1_cidr" { default = "10.0.3.0/24" }
variable "private2_cidr" { default = "10.0.4.0/24" }
