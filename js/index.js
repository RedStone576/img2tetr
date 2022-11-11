const $ = (x) => document.getElementById(x)

const mapped = {
  "0,0,136"   : "_",  
  "255,0,0"   : "z",
  "0,255,0"   : "s",
  "0,0,255"   : "j",
  "255,255,0" : "o",
  "0,255,255" : "i",
  "255,0,255" : "t",
  "255,150,0" : "l"
}

let factor = 8

$("copy").addEventListener("click", x =>
{
  navigator.clipboard.writeText($("map-string").innerHTML)

  $("copy").innerHTML = "copied"
  setTimeout(() => $("copy").innerHTML = "click to copy", 3000)
})

$("plus").addEventListener("click", x =>
{
  factor++
  $("counter").innerHTML = factor
})

$("minus").addEventListener("click", x =>
{
  if (factor < 2) return

  factor--
  $("counter").innerHTML = factor
})

const canvas = $("preview-map")
const ctx    = canvas.getContext("2d", { willReadFrequently: true })

$("input").addEventListener("change", x =>
{
  const reader = new FileReader()

  reader.readAsDataURL(x.target.files[0])
  reader.onload = () =>  
  {
    const image = new Image()
    image.src   = reader.result
    
    image.onload = () => 
    {
      const width  = image.width
      const height = image.height
      
      pixelate(reader.result, factor, width, height).then(img =>
      {
        $("preview-original").src  = reader.result
        $("preview-pixelated").src = img.toDataURL()
                
        ctx.clearRect(0, 0, width, width)
        
        canvas.height = height
        canvas.width  = width
        
        ctx.drawImage(img, 0, 0)
        
        let string = ""
        
        const { data } = ctx.getImageData(0, 0, width, height)
        
        for (let y = 0; y < height; y += factor) 
        {
          for (let x = 0; x < width; x += factor) 
          {
            const i = (x + y * width) * 4
      
            const [r, g, b] = nearest(data[i], data[i + 1], data[i + 2])
      
            string += mapped[`${r},${g},${b}`]
            
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${data[i + 3]})`
            ctx.fillRect(x, y, factor, factor)
          }
        }
        
        $("width-string").innerHTML  = Math.round(width / factor)
        $("height-string").innerHTML = Math.round(height / factor)
        $("map-string").innerHTML    = string
        $("copy").style.display      = "unset"
      })
    }
  }
})

const colors = [
  [0,   0,   136], // #
  [255, 0,     0], // z
  [0,   255,   0], // s
  [0,   0,   255], // j
  [255, 255,   0], // o
  [0,   255, 255], // i
  [255, 0,   255], // t
  [255, 150,   0]  // l
]

function nearest(r, g, b) {
  let e = Infinity
  
  let n
  let c
  let d
  
  r = Math.min(Math.max(r, 0), 255)
  g = Math.min(Math.max(g, 0), 255)
  b = Math.min(Math.max(b, 0), 255)
  
  for (c of colors) 
  {
    if (r + c[0] > 256) 
      d = 2 * (r - c[0]) * (r - c[0]) + 4 * (g - c[1]) * (g - c[1]) + 3 * (b - c[2]) * (b - c[2])
    else 
      d = 3 * (r - c[0]) * (r - c[0]) + 4 * (g - c[1]) * (g - c[1]) + 2 * (b - c[2]) * (b - c[2])
    
    if (d < e) 
    {
      e = d 
      n = c
    }
  }
  
  return n
}

