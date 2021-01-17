import React from "react";

import {
    ListItem,
    Box,
    Divider,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    IconButton,
    ListItemSecondaryAction,
    Link,
} from "@material-ui/core";

import StarIcon from "@material-ui/icons/Star";
import CodeIcon from "@material-ui/icons/Code";
import BugReportIcon from "@material-ui/icons/BugReport";

export const RepoItem: React.FC = ({ repo, toggleStar }) => {
    return (
        <Box key={repo.id} mb={2}>
            <ListItem alignItems="flex-start" disableGutters>
                <ListItemAvatar>
                    <Link href={repo.owner.profile} title="User profile">
                        <Avatar alt={repo.owner.name} src={repo.owner.avatar} />
                    </Link>
                </ListItemAvatar>

                <Box display="flex" flexDirection="column">
                    <ListItemText
                        primary={
                            <Link href={repo.url} title="Repository link">
                                {repo.name}
                            </Link>
                        }
                        secondary={
                            <Typography>
                                {repo.description || "No description available"}
                            </Typography>
                        }
                    />
                    <Box
                        mt={2}
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                    >
                        <Box display="flex">
                            <StarIcon />{" "}
                            <Box ml={1}>
                                <Typography>{repo.stars}</Typography>
                            </Box>
                        </Box>
                        <Box display="flex" ml={4}>
                            <BugReportIcon />{" "}
                            <Box ml={1}>
                                <Typography>{repo.openIssues}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center" mt={1}>
                        <CodeIcon />{" "}
                        <Box ml={1}>
                            <Typography>{repo.language}</Typography>
                        </Box>
                    </Box>
                </Box>

                <ListItemSecondaryAction>
                    <IconButton
                        onClick={() => toggleStar(repo)}
                        edge="end"
                        aria-label="comments" 
                    >
                        <StarIcon
                            color={repo.isStared ? "primary" : "disabled"}
                        />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <Divider style={{ backgroundColor: "black" }} />
        </Box>
    );
};
