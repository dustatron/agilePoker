import {
  Button,
  Container,
  Flex,
  Icon,
  Stack,
  Wrap,
  WrapItem,
  Text,
  Box,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Room, UserData } from "../../utils/types";
import { useResetAllVotes, useUpdateVoteStatus } from "../../hooks";
import Card from "../Card";
import ToolBar from "../ToolBar";
import useUpdateVote from "../../hooks/useUpdateVote";
import { useHotkeys } from "react-hotkeys-hook";
import { OPTIONS } from "../../utils/constants";
import useTimeoutState from "../../hooks/useTimeoutState";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";
import VoteCards from "../VoteCards";

type Props = {
  roomData: Room;
  roomId: string;
  voteData: UserData[];
  currentUser: UserData;
};

const PokerBoard = ({ roomData, roomId, voteData, currentUser }: Props) => {
  const [isAutoResetOn, setIsAutoResetOn] = useState(false);
  const timeout = useTimeoutState((state) => state.timeout);
  const timeoutRef = useRef<string | number | NodeJS.Timeout | undefined>();

  useHotkeys("shift+1", () => handleUpdateVote(1));
  useHotkeys("shift+2", () => handleUpdateVote(2));
  useHotkeys("shift+3", () => handleUpdateVote(3));
  useHotkeys("shift+5", () => handleUpdateVote(5));
  useHotkeys("shift+8", () => handleUpdateVote(8));
  useHotkeys("shift+s", () => handleShow());
  useHotkeys("esc", () => handleResetAllVotes());

  const resetAllVotes = useResetAllVotes(voteData, roomId);
  const { mutate: updateUserVote } = useUpdateVote();

  const handleUpdateVote = (vote: number) => {
    updateUserVote({ roomId, userId: currentUser.id, vote });
  };

  const { mutate: updateVoteStatus } = useUpdateVoteStatus();

  const handleShow = () => {
    updateVoteStatus({ roomId, isVoting: !roomData.isVoting });
  };

  const handleResetAllVotes = () => {
    resetAllVotes();
    updateVoteStatus({ roomId, isVoting: true });
  };

  const handleAutoReset = () => {
    setIsAutoResetOn(!isAutoResetOn);
  };

  useEffect(() => {
    const delay = timeout * 60000;
    if (!roomData.isVoting && isAutoResetOn) {
      timeoutRef.current = setTimeout(() => {
        handleShow();
        resetAllVotes();
      }, delay);
    }
    return () => clearInterval(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoResetOn, roomData.isVoting, timeout]);

  return (
    <Box
      bg="white"
      w="100%"
      border="1px"
      borderColor="#d4d4d4"
      padding="5"
      borderRadius="md"
      boxShadow="xl"
      backgroundColor={roomData.isVoting ? "gray.50" : "#fafafa"}
    >
      {voteData && (
        <>
          <ToolBar
            roomData={roomData}
            isAutoReset={isAutoResetOn}
            roomId={roomId}
            voteData={voteData}
            handleAutoReset={handleAutoReset}
            isAutoResetOn={isAutoResetOn}
            currentUser={currentUser}
          />
          <Flex
            minH="43vh"
            w="100%"
            justifyContent="space-between"
            direction="column"
            alignContent="space-between"
            padding="5"
          >
            <VoteCards
              currentUser={currentUser}
              roomData={roomData}
              voteData={voteData}
            />
          </Flex>
          {/* \\\\\\\\\ Voting Card /////////   */}
          <Wrap direction="row" spacing="10px" justify="center">
            {OPTIONS.map((num) => (
              <WrapItem key={num}>
                <Card number={num} select={handleUpdateVote} />
              </WrapItem>
            ))}
          </Wrap>
          <Stack direction="row" p="5" justifyContent="space-between">
            <Button
              onClick={handleResetAllVotes}
              padding="3"
              variant="outline"
              colorScheme="red"
            >
              <Text>{"Reset"}</Text>
              <Icon as={GrPowerReset} marginLeft={2} color="red.300" />
            </Button>
            <Button
              colorScheme={roomData.isVoting ? "green" : "blue"}
              padding="5px 30px"
              onClick={handleShow}
            >
              <Icon
                as={roomData.isVoting ? AiOutlineEye : AiOutlineEyeInvisible}
                marginRight={2}
              />
              {roomData.isVoting ? "Show" : "Hide"}
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default PokerBoard;
