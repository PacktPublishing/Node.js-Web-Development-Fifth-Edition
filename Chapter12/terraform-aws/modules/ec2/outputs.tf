output "ec2-public-dns" { value = aws_instance.default.public_dns }
output "ec2-public-ip"  { value = aws_instance.default.public_ip }