import { Heading } from "@chakra-ui/react";

export default function InfoTab() {
  return (
    <>
      <Heading as='h1' size='lg'>Information</Heading>
      Software information used.

      <Heading as='h2' size='md' mt={"2"}>Image Processing</Heading>
      <p>Processing large images into DZ (DeepZoom) format to be viewed on a SAGE wall</p>

      <ul style={{ marginLeft: "2em" }}>
        <li>Deep Zoom: <a href="https://en.wikipedia.org/wiki/Deep_Zoom">https://en.wikipedia.org/wiki/Deep_Zoom</a></li>
        <li>VIPS: <a href="http://www.vips.ecs.soton.ac.uk/index.php?title=VIPS">http://www.vips.ecs.soton.ac.uk/index.php?title=VIPS</a></li>
        <li>VIPS code: <a href="https://github.com/jcupitt/libvips">https://github.com/jcupitt/libvips</a></li>
        <li>Processing images: <a href="http://libvips.blogspot.com/2013/03/making-deepzoom-zoomify-and-google-maps.html">http://libvips.blogspot.com/2013/03/making
          -deepzoom-zoomify-and-google-maps.html</a></li>
        <li>Example: <a href="http://www.rollthepotato.net/~john/zoomify/1-Defaults.htm">http://www.rollthepotato.net/~john/zoomify/1-Defaults.htm</a></li>
        <li>OpenSeadragon for viewing: <a href="http://openseadragon.github.io/">http://openseadragon.github.io/</a></li>
      </ul>

      <Heading as='h2' size='md' mt={"2"}>Video Processing</Heading>

      <ul style={{ marginLeft: "2em" }}>
        <li>FFmpeg: <a href="https://www.ffmpeg.org/">https://www.ffmpeg.org/</a> A complete, cross-platform solution to record, convert and stream audio and video.
        </li>
      </ul>

      <Heading as='h2' size='md' mt={"2"}>Software and hardware</Heading>

      <ul style={{ marginLeft: "2em" }}>
        <li>SAGE3: <a href="sage3.sagecommons.org">http://sage3.sagecommons.org/</a></li>
        <li>DTN / Fiona box: <a href="https://fasterdata.es.net/science-dmz/DTN/fiona-flash-i-o-network-appliance/">https://fasterdata.es.net/science-dmz/DTN/fiona-
          flash-i-o-network-appliance/</a></li>
      </ul>
    </>
  );
}