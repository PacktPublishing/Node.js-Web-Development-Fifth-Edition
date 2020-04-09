output "vpc_id" {
    value = aws_vpc.notes.id
}

output "vpc_arn" {
    value = aws_vpc.notes.arn
}

output "vpc_cidr" {
    value = aws_vpc.notes.cidr_block
}

output "igw_id" {
    value = aws_internet_gateway.igw.id
}

output "subnet_public_id" {
    value = aws_subnet.public.id
}

output "subnet_private1_id" {
    value = aws_subnet.private1.id
}

output "subnet_private2_id" {
    value = aws_subnet.private2.id
}

output "private_rt_id" {
    value = aws_route_table.private.id
}

output "ec2-public-dns" {
    value = module.ec2.ec2-public-dns
}

output "ec2-public-ip" {
    value = module.ec2.ec2-public-ip
}

output "notesdb-address" {
    value = module.db.notesdb-address
}

output "usersdb-address" {
    value = module.db.usersdb-address
}
