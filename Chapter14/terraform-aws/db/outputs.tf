
output "notesdb-address" { value = aws_db_instance.notesdb.address }
output "usersdb-address" { value = aws_db_instance.usersdb.address }

output "notesdb_id"         { value = var.notesdb_id }
output "notesdb_name"       { value = var.notesdb_name }
output "notesdb_username"   { value = var.notesdb_username }
output "notesdb_userpasswd" { value = var.notesdb_userpasswd }
output "notesdb_port"       { value = var.notesdb_port }

output "usersdb_id"         { value = var.usersdb_id }
output "usersdb_name"       { value = var.usersdb_name }
output "usersdb_username"   { value = var.usersdb_username }
output "usersdb_userpasswd" { value = var.usersdb_userpasswd }
output "usersdb_port"       { value = var.usersdb_port }
