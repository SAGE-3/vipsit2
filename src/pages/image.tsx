import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import {
  Heading, FormControl, FormLabel, FormHelperText, Input, Button, Link, Image, HStack,
  List, ListItem, Box, Progress,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

// Get the base path, or window.location.pathname
// import { useRouter } from 'next/router';
// const router = useRouter();
// console.log("basePath>", router.basePath);

export default function ImageTab() {
  const [file, setFile] = useState<File | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [newImage, setNewImage] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  const socketInitializer = async () => {
    const socketURL = window.location.pathname + '/api/socket';
    console.log('Setup socket>', socketURL);
    await fetch(socketURL);
    const socketType = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const pathname = window.location.pathname;
    let s: WebSocket;
    if (pathname.endsWith('/')) {
      s = new WebSocket(`${socketType}//${window.location.host}${window.location.pathname}socket`);
    } else {
      s = new WebSocket(`${socketType}//${window.location.host}${window.location.pathname}/socket`);
    }
    console.log('   -> socket', s);
    setSocket(s);
    s.addEventListener('open', (e) => {
      console.log('   -> socket opened', e);
      s.send('Hello from client');
    });
  };

  useEffect(() => {
    if (!socket) socketInitializer();
    return () => {
      if (!socket) { return; }
      socket.close();
    };
  }, [socket]);

  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("From onFileUploadChange", e);
    const fileInput = e.target;
    if (!fileInput.files) {
      return;
    }
    if (!fileInput.files || fileInput.files.length === 0) {
      return;
    }
    const ff = fileInput.files[0];
    if (!ff.type.startsWith("image")) {
      return;
    }
    setFile(ff);
  };

  const onUploadFile = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!file) { return; }
    try {
      setUploading(true);
      let formData = new FormData();
      formData.append("media", file);

      const res = await fetch(window.location.pathname + "/api/upload", {
        method: "POST",
        body: formData,
      });

      const { data, error, }: {
        data: { url: string } | null;
        error: string | null;
      } = await res.json();

      if (error || !data) {
        alert(error || "Sorry! something went wrong.");
        setUploading(false);
        return;
      }
      console.log("File was uploaded successfylly:", data);
      setNewImage(true);
      setUploading(false);

    } catch (error) {
      console.error(error);
      alert("Sorry! something went wrong.");
      setUploading(false);
    }
  };

  useEffect(() => {
    async function getImages() {
      // get the list of images
      const res = await fetch(window.location.pathname + "/api/images");
      const json = await res.json();
      if (!json.error) {
        const images = json.data;
        console.log('res', images);
        setImages(images);
      }
    }
    getImages();
  }, [newImage]);

  return (
    <>
      <Heading as='h1' size='lg'>Image Processing</Heading>

      <Heading as='h2' size='md' mt={"25px"} mb={"5px"}>Upload an image</Heading>

      <FormControl
        onSubmit={(e) => e.preventDefault()}
      >
        <FormLabel>Select an image to upload:</FormLabel>
        <Input type='file' w={300} multiple={false} onChange={onFileUploadChange}
        />
        <FormHelperText>Image formats: PNG, TIFF, JPEG, ...</FormHelperText>
        <Button
          mt={4}
          colorScheme='teal'
          type='submit'
          onClick={onUploadFile}
          disabled={uploading}
        >
          {uploading ? "Uploading" : "Upload"}
        </Button>

      </FormControl>

      {uploading &&
        <Progress m={2} w={"50%"} size='xs' isIndeterminate />
      }

      <Heading as='h2' size='md' mt={"25px"} mb={"5px"}>Processed Images</Heading>
      <List>
        {images.map((image: any, i: number) => (<ListItem key={i} >
          <HStack p={1}>
            <Box overflow={"clip"} border={"1px"}>
              <Image w={200} h={120} alt="icon" src={window.location.pathname + image.image} objectFit={"cover"} />
            </Box>
            <Link download color='teal.500' href={window.location.pathname + image.link}> <em> {image.name}</em> <ExternalLinkIcon mx='2px' /> </Link>
          </HStack>
        </ListItem>
        ))}
      </List >
    </>
  );
}