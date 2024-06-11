import Image from "next/image";
import React from "react";
import logo from "../../public/images/logo-congress.png";
import Link from "next/link";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";

export default function Navbar(props: any) {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);
  return (
    <nav
      className={
        (props.transparent
          ? "top-0 absolute z-50 w-full"
          : "relative shadow-lg bg-white shadow-lg w-full") +
        " flex flex-wrap items-center justify-between px-2 py-3 "
      }
    >
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between">
          <div className={isOpen ? "md:flex xs:hidden" : ""}>
            <Link
              className={
                (props.transparent ? "text-white" : "text-gray-800") +
                " text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
              }
              href={process.env.NEXT_PUBLIC_URL ?? "/"}
            >
              <Image src={logo} width={200} className="inline" alt="" />
            </Link>
          </div>
          {/* <Box className="md:hidden">
            <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
              ☰
            </Button>

            <Drawer
              isOpen={isOpen}
              placement="left"
              onClose={onClose}
              finalFocusRef={btnRef}
            >
              <DrawerOverlay>
                <DrawerContent>
                  <DrawerCloseButton onClick={onClose} />
                  <DrawerHeader>
                    <Image src={logo} width={200} className="inline" alt="" />
                  </DrawerHeader>

                  <DrawerBody>
                    <p>Boleteria</p>
                    <p>Organización</p>
                  </DrawerBody>
                </DrawerContent>
              </DrawerOverlay>
            </Drawer>
          </Box> */}
          <Box className="flex items-center gap-4 font-semibold text-lg">
            <Link href={`/boleteria`} className="hover:border-solid hover:border-2 py-2 px-4 hover:rounded-lg">
              Boleteria
            </Link>
            <Link href={`/organizacion`} className="hover:border-solid hover:border-2 py-2 px-4 hover:rounded-lg">
              Organización
            </Link>
          </Box>
        </div>
        <div
          className={
            "lg:flex flex-grow items-center bg-white lg:bg-transparent lg:shadow-none" +
            (navbarOpen ? " block rounded shadow-lg" : " hidden")
          }
          id="example-navbar-warning"
        ></div>
      </div>
    </nav>
  );
}
