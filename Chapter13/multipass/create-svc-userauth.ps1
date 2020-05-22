multipass launch --name svc-userauth
multipass mount ../users svc-userauth:/build-users
multipass mount (get-location) svc-userauth:/build
