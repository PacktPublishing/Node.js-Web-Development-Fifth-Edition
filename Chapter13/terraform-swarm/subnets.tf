
resource "aws_subnet" "public1" {
  vpc_id     = aws_vpc.notes.id
  cidr_block = var.public1_cidr
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    Name = "${var.project_name}-net-public1"
  }
}

/* resource "aws_subnet" "public2" {
  vpc_id     = aws_vpc.notes.id
  cidr_block = var.public2_cidr
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name = "${var.project_name}-net-public2"
  }
} */

resource "aws_subnet" "private1" {
  vpc_id     = aws_vpc.notes.id
  cidr_block = var.private1_cidr
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    Name = "${var.project_name}-net-private1"
  }
}

/* resource "aws_subnet" "private2" {
  vpc_id     = aws_vpc.notes.id
  cidr_block = var.private2_cidr
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name = "${var.project_name}-net-private2"
  }
} */
