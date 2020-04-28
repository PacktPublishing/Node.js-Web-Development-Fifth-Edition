multipass launch --name svc-notes
multipass mount ../notes svc-notes:/build-notes
multipass mount `pwd` svc-notes:/build
