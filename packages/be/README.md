
### Server keys for development

```shell
openssl req -x509 -newkey rsa:4096 -nodes \
  -keyout dev.key.pem \
  -out dev.cert.pem \
  -sha512 \
  -days 365 \
  -subj "/C=GE/ST=Tbilisi/O=twowls.org/CN=dev.local" \
  -addext "subjectAltName = DNS:dev.local, DNS:*.dev.local"
```
