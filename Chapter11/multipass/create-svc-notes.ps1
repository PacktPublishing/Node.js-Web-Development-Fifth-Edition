multipass launch --name svc-notes
multipass mount ../notes svc-notes:/build-notes
multipass mount (get-location) svc-notes:/build
