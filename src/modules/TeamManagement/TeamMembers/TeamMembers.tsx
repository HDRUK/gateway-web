import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import useDialog from "@/hooks/useDialog";
import AddTeamMemberDialog from "@/modules/dialogs/AddTeamMemberDialog";

import AddIcon from '@mui/icons-material/Add';

const TeamMembers = () => {
    const { showDialog } = useDialog();
    
    const dummyList = [
        {
            name: "Loki Sinclair",
            role: "custodian.admin",
            perms: [],
        },
    ];

    return (
        <BoxContainer>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
            }}>
                <Button onClick={() => showDialog(AddTeamMemberDialog)}><AddIcon /> Add a new member</Button>
            </Box>
            <Box>Something</Box>
        </BoxContainer>
    );
};

export default TeamMembers;
