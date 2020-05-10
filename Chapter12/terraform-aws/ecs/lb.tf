# alb.tf

resource "aws_lb" "notes" {
  name            = "${data.terraform_remote_state.vpc.outputs.vpc_name}-load-balancer"
  internal           = false
  load_balancer_type = "application"
  subnets         = [ data.terraform_remote_state.vpc.outputs.subnet_public1_id, data.terraform_remote_state.vpc.outputs.subnet_public2_id ]
  security_groups = [ aws_security_group.lb.id ]
}

resource "aws_alb_target_group" "notes" {
  name        = "${data.terraform_remote_state.vpc.outputs.vpc_name}-target-group"
  port        = var.notes_port
  protocol    = "HTTP"
  vpc_id      = data.terraform_remote_state.vpc.outputs.vpc_id 
  target_type = "ip"

  /* health_check {
    healthy_threshold   = "3"
    interval            = "30"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "3"
    path                = "/"
    unhealthy_threshold = "2"
  } */
}

# Redirect all traffic from the ALB to the target group
resource "aws_alb_listener" "notes" {
  load_balancer_arn = aws_lb.notes.id
  port              = var.notes_port
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_alb_target_group.notes.id
    type             = "forward"
  }
}

resource "aws_security_group" "lb" {
  name        = "${data.terraform_remote_state.vpc.outputs.vpc_name}-load-balancer-security-group"
  description = "controls access to the ALB"
  vpc_id      = data.terraform_remote_state.vpc.outputs.vpc_id 

  ingress {
    protocol    = "tcp"
    from_port   = 0
    to_port     = var.notes_port
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}
