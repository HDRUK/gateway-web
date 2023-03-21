## Gateway Web Tiltfile
##
## Loki Sinclair <loki.sinclair@hdruk.ac.uk>
##

cfg = read_json('tiltconf.json')

docker_build(
    ref='hdruk/' + cfg.get('name'),
    context='.',
    live_update=[
        sync('./src', '/usr/src'),
        run('npm install', trigger='./package-lock.json')
    ]
)

k8s_yaml('chart/' + cfg.get('name') + '/' + cfg.get('name') + '.yaml')
k8s_resource(
    cfg.get('name'),
    port_forwards=3000
)