export const IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10MB
export const VIDEO_MAX_SIZE = 200 * 1024 * 1024; // 200MB

/* IMAGE TYPES */
export const BASIC_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
  "image/gif",
  "image/webp",
  "image/tiff",
  "image/bmp",
  "image/heic",
]

export const ALL_IMAGE_TYPES_ORD1 = [
  ...BASIC_IMAGE_TYPES,
  "image/heif",
  "image/avif",
  "image/x-icon",
  "image/vnd.microsoft.icon", 
  "image/tga",
  "image/jp2",
  "image/ktx",
  "image/ktx2",
  "image/jxr",
  "image/sgi",
  "image/cur",
  "image/pcx",
  "image/dicom-rle",
  "image/dpx",
  "image/eps",
  "image/psd",
  "image/xbm",
  "image/xpm",
  "image/xcf",
  "image/xwd",
];

export const ACCEPTED_IMAGE_TYPES = [
  ...BASIC_IMAGE_TYPES,
]

/* VIDEO TYPES */
export const BASIC_VIDEO_TYPES=
[
  "video/mp4",
  "video/mpeg", 
  "video/quicktime",
  "video/webm",
  "video/x-matroska",
]
export const ALL_VIDEO_TYPES_ORD2 = [
  ...BASIC_VIDEO_TYPES,
  "video/avi",
  "video/3gpp",
  "video/3gpp2",
  "video/x-msvideo",
  "video/x-flv",
  "video/x-ms-wmv",
  "video/x-ms-asf",
  "video/ogg",
]

export const ACCEPTED_VIDEO_TYPES = [
  ...BASIC_VIDEO_TYPES,
];

/* TEXT TYPES */
export const ALL_TEXT_TYPES_ORD3 = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
];

export const ACCEPTED_TEXT_TYPES = [
  ...ALL_TEXT_TYPES_ORD3,
]

/* PROGRAMMING TYPES */
export const USUALPROGRAMMING_TYPES = [
  "text/csv",
  "application/json",
  "application/xml",
]

export const ALLPROGRAMMING_TYPES_ORD5 = [
  ...USUALPROGRAMMING_TYPES,
  "text/html",
  "text/css", 
  "text/markdown",
  "application/javascript",
  "application/x-python-code",
  "application/x-ruby",
  "application/x-php",
  "application/x-java",
  "application/x-c",
  "application/x-c++",
  "application/x-shellscript",
  "application/x-perl",
  "application/x-go",
  "application/x-rust",
  "application/x-swift",
  "application/x-kotlin",
  "application/x-typescript",
  "application/x-haskell",
  "application/x-lua",
  "application/x-sql",
  "application/x-yaml",
  "application/x-toml",
  "application/x-sh",
  "application/x-bash",
  "application/x-zsh",
  "application/x-csh",
  "application/x-fish",
  "application/x-powershell",
  "application/x-dockerfile",
  "application/x-makefile",
  "application/x-gradle",
  "application/x-cmake",
  "application/x-groovy",
  "application/x-scala",
  "application/x-erlang",
  "application/x-elixir",
  "application/x-clojure",
  "application/x-lisp",
  "application/x-prolog",
  "application/x-scheme",
  "application/x-racket",
  "application/x-smalltalk",
  "application/x-ada",
  "application/x-fortran",
  "application/x-cobol",
  "application/x-assembly",
  "application/x-vhdl",
  "application/x-verilog",
  "application/x-awk",  
  "application/x-sed",
  "application/x-m4",
  "application/x-autoconf",
  "application/x-automake",
  "application/x-libtool",
  "application/x-nasm",
  "application/x-yacc",
  "application/x-bison",
  "application/x-flex",
  "application/x-rpm-spec",
  "application/x-systemtap",
  "application/x-dtrace",
  "application/x-nim",
  "application/x-crystal",
  "application/x-dart",
  "application/x-vue",
  "application/x-svelte",
  "application/x-elm",
  "application/x-haxe",
  "application/x-nix",
  "application/x-reasonml",
  "application/x-ocaml",
  "application/x-forth",
  "application/x-pascal",
  "application/x-delphi",
  "application/x-modula-2", 
]

export const ACCEPTED_PROGRAMMING_TYPES = [
  ...USUALPROGRAMMING_TYPES,
]

/* ARCHIVE TYPES */
export const ALL_ARCHIVE_TYPES_ORD4 = [
  "application/zip",
  "application/x-rar-compressed",  
  "application/x-7z-compressed",
  "application/x-tar",
  "application/gzip",
  "application/x-bzip2",
]

export const ACCEPTED_ARCHIVE_TYPES = [
  ...ALL_ARCHIVE_TYPES_ORD4,
]

/* ALL FILE TYPES */
export const ALL_ALLFILE_TYPES_ORD0 = [ 
  ...ALL_IMAGE_TYPES_ORD1,
  ...ALL_VIDEO_TYPES_ORD2,
  ...ALL_TEXT_TYPES_ORD3,
  ...ALL_ARCHIVE_TYPES_ORD4,
  ...ALLPROGRAMMING_TYPES_ORD5
];

/* Combine all accepted types into one array */
export const ACCEPTED_ALLFILE_TYPES = [ 
  ...ACCEPTED_IMAGE_TYPES,
  ...ACCEPTED_VIDEO_TYPES,
  ...ACCEPTED_TEXT_TYPES,
  ...ACCEPTED_ARCHIVE_TYPES,
  ...ACCEPTED_PROGRAMMING_TYPES
];