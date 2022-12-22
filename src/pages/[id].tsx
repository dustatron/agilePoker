import { Box, Center, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { Room, UserData } from "../utils/types";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

import PokerBoard from "../components/PokerBoard";
import { getFirestore } from "../utils/firebase";
import { useRouter } from "next/router";

const getSnap = async (docRef: any) => {
  return await getDoc(docRef);
};

const Poker = () => {
  const router = useRouter();
  const { query } = router;
  const firebaseApp = getFirestore();
  const [docR, setDocR] = useState();

  const [roomData, loading, error] = useDocument(
    doc(firebaseApp, "rooms", `${query.id}`)
  );

  // const docRef = doc(firebaseApp, "rooms", `${query.id}`);
  // getSnap(docRef).then((result) => setDocR(result));

  const [votes, votesLoading, votesError] = useCollection(
    collection(firebaseApp, `rooms/${query.id}/votes`)
  );

  const voteData = votes?.docs.map((doc) => doc.data());

  const roomDataReal = roomData?.data();

  const makeNewRoom = async () => {
    const roomName = query.id as string;
    const newRoom: Room = {
      name: query.id as string,
      isVoting: true,
    };
    try {
      await setDoc(doc(firebaseApp, "rooms", roomName.toLowerCase()), newRoom);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const makeNewRoomMemo = useCallback(() => makeNewRoom(), [query.id]);

  // Create room if room data return undefined
  useEffect(() => {
    if (!roomDataReal && !loading && !error) {
      makeNewRoomMemo();
    }
  }, [error, loading, makeNewRoomMemo, roomDataReal]);

  // useEffect(() => {
  //   getSnap(docRef).then((result) => {
  //     console.log("result", result);
  //   });
  // }, []);

  console.log("roomData", roomData);
  console.log("loading", loading);
  console.log("error", error);
  console.log("loading", query);
  return (
    <div>
      {loading && (
        <Stack w="100%" minH="60vh" justifyContent="center">
          <Box>
            <Text as="h2" fontWeight="bold" fontSize="xl" textAlign="center">
              Loading
            </Text>
          </Box>
          <Center>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Center>
        </Stack>
      )}
      {roomDataReal && !loading && !error && (
        <>
          <Heading textAlign="center" marginBottom={2}>
            {roomDataReal.name.charAt(0).toUpperCase() +
              roomDataReal.name.slice(1).toLowerCase()}{" "}
            Room
          </Heading>
          <PokerBoard
            roomId={query.id as string}
            roomData={roomDataReal as Room}
            voteData={voteData as UserData[]}
            votesLoading={votesLoading}
          />
        </>
      )}
    </div>
  );
};

export default Poker;
