
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.notes.id

  tags = {
    Name =  "${var.project_name}-IGW"
  }
}

resource "aws_eip" "gw" {
  vpc        = true
  depends_on = [ aws_internet_gateway.igw ]

  tags = {
    Name =  "${var.project_name}-EIP"
  }
}

resource "aws_nat_gateway" "gw" {
  subnet_id     = aws_subnet.public1.id
  allocation_id = aws_eip.gw.id

  tags = {
    Name =  "${var.project_name}-NAT"
  }
}
