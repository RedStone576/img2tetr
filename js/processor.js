function pixelate(base64, factor, width, height)
{
  let img = new Image()
  img.src = base64
  
  const original  = document.createElement("canvas")
  const processed = document.createElement("canvas")
  
  original.height = height
  original.width  = width
  
  processed.height = height
  processed.width  = width
  
  const originalContext  = original.getContext("2d")
  const processedContext = processed.getContext("2d")
  
  return new Promise(resolve => 
  {
    img.onload = () =>
    {
      originalContext.clearRect(0, 0, width, width)
      originalContext.drawImage(img, 0, 0)
      
      const originalData = originalContext.getImageData(0, 0, width, height).data
    
      for (let y = 0; y < height; y += factor) 
      {
        for (let x = 0; x < width; x += factor) 
        {
          const pos = (x + y * width) * 4
          
          processedContext.fillStyle = `rgba(${originalData[pos]}, ${originalData[pos + 1]}, ${originalData[pos + 2]}, ${originalData[pos + 3]})`
          processedContext.fillRect(x, y, factor, factor)
        }
      }
      
      resolve(processed)
    }
  })
}
