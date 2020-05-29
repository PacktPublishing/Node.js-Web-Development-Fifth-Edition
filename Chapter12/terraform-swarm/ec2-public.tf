resource "aws_instance" "public" {
    ami           = var.ami_id
    instance_type = var.instance_type
    subnet_id     = aws_subnet.public1.id
    key_name      = var.key_pair
    vpc_security_group_ids = [ aws_security_group.ec2-public-sg.id ]
    associate_public_ip_address = true

    tags = {
        Name = "${var.project_name}-ec2-public"
    }

    depends_on = [ aws_vpc.notes, aws_internet_gateway.igw  ]
    user_data = join("\n", [
        "#!/bin/sh",
        file("sh/docker_install.sh"),
        "docker swarm init",
        "sudo hostname ${var.project_name}-public"
    ]) 
}

resource "aws_security_group" "ec2-public-sg" {
  name        = "${var.project_name}-public-security-group"
  description = "allow inbound access to the EC2 instance"
  vpc_id      = aws_vpc.notes.id

  ingress {
    protocol    = "TCP"
    from_port   = 22
    to_port     = 22
    cidr_blocks = [ "0.0.0.0/0" ]
  }

  ingress {
    protocol    = "TCP"
    from_port   = 80
    to_port     = 80
    cidr_blocks = [ "0.0.0.0/0" ]
  }

  ingress {
    protocol    = "TCP"
    from_port   = 443
    to_port     = 443
    cidr_blocks = [ "0.0.0.0/0" ]
  }

  ingress {
    protocol    = "TCP"
    from_port   = 2377
    to_port     = 2377
    cidr_blocks = [ aws_vpc.notes.cidr_block ]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = [ "0.0.0.0/0" ]
  }
}

output "ec2-public-arn" { value = aws_instance.public.arn }

output "ec2-public-dns" { value = aws_instance.public.public_dns }
output "ec2-public-ip"  { value = aws_instance.public.public_ip }

output "ec2-private-dns" { value = aws_instance.public.private_dns }
output "ec2-private-ip"  { value = aws_instance.public.private_ip }
