const { ChildProcess } = require("child_process");
const os = require("os");

const hostname = os.hostname();
console.log("내 pc의 호스트 네임은", hostname);

const tmpDir = os.tmpdir();
console.log("내 pc에서 사용하는 temp 디렉터리", tmpDir);

const cpus = os.cpus();
// console.log("내 pc의 cpu", cpus);
console.log("내 pc의 첫번째 코어정보", cpus[0]);

const platform = os.platform();
console.log("내 pc의 운영체제는", platform);

const version = os.version();
console.log("내 pc의 운영체제 버전", version);

const release = os.release();
console.log("내 pc의 운영체제 릴리즈", release);
