{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.typescript
    pkgs.nodePackages.typescript-language-server
    pkgs.postgresql_15
    pkgs.redis
    pkgs.git
    pkgs.openssl
    pkgs.pkg-config
    pkgs.python3
    pkgs.gcc
  ];
  env = {
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
      pkgs.openssl
    ];
  };
}