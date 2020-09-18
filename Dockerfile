  
FROM alpine
LABEL MAINTAINER rx <https://github.com/rx7910>

ARG GOOS=linux
ARG GOARCH=arm
ARG VER=0.32.1
ARG URL=https://github.com/fatedier/frp/releases/download/v${VER}/frp_${VER}_${GOOS}_${GOARCH}.tar.gz

# /usr/bin/{frps, frpc}
# /frp/{frps, frpc, frps_full, frpc_full}.ini
RUN mkdir -p /frp \
    && cd /frp\
    && wget -qO- ${URL} | tar xz \
    && mv frp_*/frpc /usr/bin/ \
    && mv frp_*/frps /usr/bin/ \
    && mv frp_*/*.ini ./ \
    && rm frp_* -rf

VOLUME /frp

ENV ARGS=frps

CMD /usr/bin/${ARGS} -c /frp/${ARGS}.ini
