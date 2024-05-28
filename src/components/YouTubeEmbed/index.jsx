const YouTubeEmbed = ({ videoUrl }) => {
  if (!videoUrl) return
  ;<div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      fontWeight: 'bold',
      fontSize: '20px',
      color: 'gray'
    }}
  >
    <p>Link không hợp lệ</p>
  </div>
  const videoId = videoUrl.split('v=')[1]
  if (!videoId)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          fontWeight: 'bold',
          fontSize: '20px',
          color: 'gray'
        }}
      >
        <p>Link không hợp lệ</p>
      </div>
    )
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`
  return (
    <>
      <div style={{ height: '100%' }}>
        <iframe
          className=" top-0 w-full "
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded YouTube Video"
        ></iframe>
      </div>
    </>
  )
}

export default YouTubeEmbed
