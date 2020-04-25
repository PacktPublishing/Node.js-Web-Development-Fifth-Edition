variable "ami_id" {
    // Ubuntu Server 18.04 LTS (HVM), SSD Volume Type in us-west-2 
    default = "ami-0d1cd67c26f5fca19"
}
variable "vpc_id" {}
variable "igw_id" {}
variable "instance_type" {}
variable "subnet_id" {}
variable "name" {}
variable "key_pair" {}
variable "user_data" {}