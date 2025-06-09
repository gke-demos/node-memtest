//import { Buffer } from 'node:buffer';
import { readFileSync } from 'fs';
import { memoryUsage } from 'node:process';
import { constants } from 'node:buffer';


function getCgroupMemoryLimit() {
  try {
    const cgroupPath = readFileSync('/proc/self/cgroup', 'utf-8').trim().split('\n')[0].split('::')[1];
    const memoryLimitPath = `/sys/fs/cgroup${cgroupPath}/memory.max`;
    const memoryLimitBytes = parseInt(readFileSync(memoryLimitPath, 'utf-8').trim());
    return memoryLimitBytes;
  } catch (error) {
    console.error('Error reading cgroup memory limit:', error);
    return null;
  }
}

function freeMemory() {
  return getCgroupMemoryLimit() - memoryUsage().external
}

var currentMemoryLimit = getCgroupMemoryLimit();

// set size equal to current limit or the max size allowed for Buffer (depends on Node version)
var size = Math.min(currentMemoryLimit, constants.MAX_LENGTH)

var bufs = []
// allocate a buffer which uses 90% of the available size
var buf = Buffer.alloc(0.9*size)
console.log('Allocated buffer with size ', 0.9*size)
bufs.push(buf)


setInterval(()=>{
  var memoryLimitBytes = getCgroupMemoryLimit()
  if (memoryLimitBytes > currentMemoryLimit) {
    console.log("WE HAVE MORE MEMORY!")
    // add another buffer with 90% of free memory
    let newBuf = Buffer.alloc(0.9*freeMemory())
    bufs.push(newBuf)
    currentMemoryLimit = memoryLimitBytes
  }
  // fill buffers with data
  for (let i = 0;i<bufs.length;i++){
    bufs[i].fill(0x22)
  }
  console.log("memory limit: ",memoryLimitBytes)
  console.log("memory usage: ",memoryUsage())
  console.log("free memory: ",freeMemory())
  
},1000)

