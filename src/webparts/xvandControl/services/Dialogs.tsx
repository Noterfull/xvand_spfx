// Dialogs.tsx
import * as React from 'react';
import {
    Dialog,
    DialogSurface,
    DialogBody,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Checkbox,
    Input,
    Field, RadioGroup, Radio,
    Textarea,
    Dropdown,
    Option,
    useId
} from '@fluentui/react-components';
import MSGraphService from './MSGraphService';
import styles from './Dialogs.module.scss';
import { User } from '@microsoft/microsoft-graph-types';
import { generateSecurePassword } from './PasswordGenerator';
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface BaseDialogProps {
    onClose: () => void;
    context: WebPartContext;
}

interface AddUserDialogProps extends BaseDialogProps {
}

interface AddMultiUserDialogProps extends BaseDialogProps {
    userCount?: number;
}

interface AddRoleDialogProps extends BaseDialogProps {
    roleName?: string;
}

interface PrintDialogProps extends BaseDialogProps {
    contentToPrint?: string;
}

interface CreateMailboxDialogProps extends BaseDialogProps {
    mailboxName?: string;
}

type DialogPropsMap = {
    addUser: AddUserDialogProps;
    addMultiUser: AddMultiUserDialogProps;
    addRole: AddRoleDialogProps;
    print: PrintDialogProps;
    createMailbox: CreateMailboxDialogProps;
    //   exportToExcel: ExportToExcelDialogProps;
};

type DialogManagerProps = {
    openDialogId?: string;
    dialogProps?: Partial<DialogPropsMap[keyof DialogPropsMap]>;
    context: WebPartContext;
    onClose: () => void;
};

const AddUserDialog: React.FC<AddUserDialogProps> = ({ onClose, context }) => {
    const [IsTestAccount, setIsTestAccount] = React.useState(false);
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [securityAndGroup, setSecurityAndGroup] = React.useState("");
    const [notes, setNotes] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [fieldsDisabled, setFieldsDisabled] = React.useState<boolean>(false);
    const [allDomains, setallDomains] = React.useState<string[]>([]);
    const [domain, setDomain] = React.useState<string>("");
    const [errors, setErrors] = React.useState({
        firstName: false,
        lastName: false,
        domain: false,
    });


    const handleCheckboxChange = (_: React.FormEvent<HTMLInputElement>, data: { checked: boolean }): void => {
        setIsTestAccount(data.checked);
        setFieldsDisabled(data.checked);
    };

    const handleSubmit = async (): Promise<void> => {
        const hasErrors = {
            firstName: firstName.trim() === '',
            lastName: lastName.trim() === '',
            domain: domain === '',
        };

        setErrors(hasErrors);

        const isValid = !Object.values(hasErrors).some(Boolean);
        if (isValid) {
            console.log("context", context);
            setLoading(true);
            try {
                const domains = await MSGraphService.getDomains();
                console.log("Domains:", domains);
                const user: User = {
                    accountEnabled: true,
                    displayName: `${firstName} ${lastName}`,
                    mailNickname: `${firstName}${lastName}`,
                    passwordProfile: {
                        password: generateSecurePassword(),
                        forceChangePasswordNextSignIn: false,
                    },
                    userPrincipalName: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`, // Replace with your domain
                }
                console.log('Adding user:', user);
                const response = await MSGraphService.addUser(user);
                if (response.userPrincipalName) {
                    alert(`User ${response.userPrincipalName} added successfully.`);
                }
                onClose();
            } catch (error) {
                alert('Error: ' + (error as Error).message);
            } finally {
                setLoading(false);
            }
        }
    };

    React.useEffect(() => {
        (async () => {
            try {
                const domains = await MSGraphService.getDomains();
                setallDomains(domains);
            } catch (error) {
                console.error('Error fetching domains:', error);
            }
        })().catch((err) => {
            console.error('Unhandled error in useEffect domains:', err);
        });
    }, []);

    return (
        <Dialog open onOpenChange={() => onClose()}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle className={styles.dialogTitle}>Add User</DialogTitle>
                    <DialogContent>
                        <Checkbox
                            size='medium'
                            label="Test User"
                            checked={IsTestAccount}
                            onChange={handleCheckboxChange}
                        />
                        <Field
                            label="First Name"
                            required
                            validationState={errors.firstName ? 'error' : undefined}
                            validationMessage={errors.firstName ? 'First Name are required' : undefined}>
                            <Input
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                            />
                        </Field>
                        <Field
                            label="Last Name"
                            required
                            validationState={errors.lastName ? 'error' : undefined}
                            validationMessage={errors.lastName ? 'Last Name are required' : undefined}>
                            <Input
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                            />
                        </Field>
                        <Field
                            label="User Domain"
                            required
                            validationState={errors.domain ? 'error' : undefined}
                            validationMessage={errors.domain ? 'User Domain is required' : undefined}>
                            <Dropdown
                                id={useId("domain-select")}
                                placeholder="Select domain"
                                value={domain}
                                onOptionSelect={(_, data) => setDomain(data.optionValue as string)}
                            >
                                {allDomains.map((option) => (
                                    <Option key={option} value={option}>
                                        {option}
                                    </Option>
                                ))}
                            </Dropdown>
                        </Field>
                        <RadioGroup
                            value={securityAndGroup}
                            onChange={(_, data) => setSecurityAndGroup(data.value)}
                            disabled={fieldsDisabled}
                        >
                            <Radio value="copyFrom" label="Copy from another Role/User" />
                            <Radio value="setManually" label="Set applications and security groups manually" />
                        </RadioGroup>
                        <Field label="Notes">
                            <Textarea
                                appearance="outline"
                                resize="vertical"
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                            />
                        </Field>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            appearance="primary"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'OK'}
                        </Button>
                        <Button
                            appearance="secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

const AddMultiUserDialog: React.FC<AddMultiUserDialogProps> = ({ onClose, userCount }) => (
    <Dialog open onOpenChange={() => onClose()}>
        <DialogSurface>
            <DialogBody>
                <DialogTitle>Add Multiple Users</DialogTitle>
                <DialogContent>
                    {userCount ? `Adding ${userCount} users.` : 'Content for adding multiple users.'}
                </DialogContent>
                <DialogActions>
                    <Button appearance="primary" onClick={onClose}>OK</Button>
                    <Button appearance="secondary" onClick={onClose}>Cancel</Button>
                </DialogActions>
            </DialogBody>
        </DialogSurface>
    </Dialog>
);

const AddRoleDialog: React.FC<AddRoleDialogProps> = ({ onClose, roleName }) => (
    <Dialog open onOpenChange={() => onClose()}>
        <DialogSurface>
            <DialogBody>
                <DialogTitle>Add Role</DialogTitle>
                <DialogContent>
                    {roleName ? `Adding role: ${roleName}` : 'Content for adding role.'}
                </DialogContent>
                <DialogActions>
                    <Button appearance="primary" onClick={onClose}>OK</Button>
                    <Button appearance="secondary" onClick={onClose}>Cancel</Button>
                </DialogActions>
            </DialogBody>
        </DialogSurface>
    </Dialog>
);

const PrintDialog: React.FC<PrintDialogProps> = ({ onClose, contentToPrint }) => (
    <Dialog open onOpenChange={() => onClose()}>
        <DialogSurface>
            <DialogBody>
                <DialogTitle>Print</DialogTitle>
                <DialogContent>
                    {contentToPrint ?? 'Content to print.'}
                </DialogContent>
                <DialogActions>
                    <Button appearance="primary" onClick={onClose}>Print</Button>
                    <Button appearance="secondary" onClick={onClose}>Cancel</Button>
                </DialogActions>
            </DialogBody>
        </DialogSurface>
    </Dialog>
);

const CreateMailboxDialog: React.FC<CreateMailboxDialogProps> = ({ onClose, mailboxName }) => (
    <Dialog open onOpenChange={() => onClose()}>
        <DialogSurface>
            <DialogBody>
                <DialogTitle>Create Shared Mailbox</DialogTitle>
                <DialogContent>
                    {mailboxName ? `Mailbox name: ${mailboxName}` : 'Content for creating mailbox.'}
                </DialogContent>
                <DialogActions>
                    <Button appearance="primary" onClick={onClose}>Create</Button>
                    <Button appearance="secondary" onClick={onClose}>Cancel</Button>
                </DialogActions>
            </DialogBody>
        </DialogSurface>
    </Dialog>
);

export const DialogsManager: React.FC<DialogManagerProps> = ({
    openDialogId,
    dialogProps = {},
    onClose,
    context
}) => {
    if (!openDialogId) return null;

    switch (openDialogId) {
        case 'addUser':
            return <AddUserDialog {...(dialogProps as AddUserDialogProps)} onClose={onClose} context={context} />;
        case 'addMultiUser':
            return <AddMultiUserDialog {...(dialogProps as AddMultiUserDialogProps)} onClose={onClose} />;
        case 'addRole':
            return <AddRoleDialog {...(dialogProps as AddRoleDialogProps)} onClose={onClose} />;
        case 'print':
            return <PrintDialog {...(dialogProps as PrintDialogProps)} onClose={onClose} />;
        case 'createMailbox':
            return <CreateMailboxDialog {...(dialogProps as CreateMailboxDialogProps)} onClose={onClose} />;
        default:
            return null;
    }
};
