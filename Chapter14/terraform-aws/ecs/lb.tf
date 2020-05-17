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

  health_check {
    healthy_threshold   = "3"
    interval            = "30"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "3"
    path                = "/"
    unhealthy_threshold = "2"
  }
}

# Redirect all traffic from the ALB to the target group
resource "aws_alb_listener" "notes" {
  load_balancer_arn = aws_lb.notes.id
  port              = var.notes_port
  protocol          = "HTTP"

  /* default_action {
    target_group_arn = aws_alb_target_group.notes.id
    type             = "forward"
  } */
  default_action {
    type = "redirect"

    redirect {
      port        = var.notes_https_port
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "notes-https" {
  load_balancer_arn = aws_lb.notes.id
  port              = var.notes_https_port
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = data.aws_acm_certificate.wwwatts.arn // "arn:aws:acm:us-west-2:098106984154:certificate/4c78e86a-7b9a-494d-96f2-8eb14ee9f04a"

  default_action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.notes.id
  }
}

data "aws_acm_certificate" "wwwatts" {
  domain      = "wwwatts.net"
  types       = ["AMAZON_ISSUED"]
  most_recent = true
}

resource "aws_security_group" "lb" {
  name        = "${data.terraform_remote_state.vpc.outputs.vpc_name}-load-balancer-security-group"
  description = "controls access to the ALB"
  vpc_id      = data.terraform_remote_state.vpc.outputs.vpc_id 

  ingress {
    protocol    = "tcp"
    from_port   = var.notes_port
    to_port     = var.notes_port
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    protocol    = "tcp"
    from_port   = var.notes_https_port
    to_port     = var.notes_https_port
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}
