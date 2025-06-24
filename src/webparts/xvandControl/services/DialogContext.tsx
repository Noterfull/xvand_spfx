import * as React from 'react';
import { createContext, useContext, useState } from 'react';
import { DialogPropsMap, DialogsManager } from './Dialogs';
import { WebPartContext } from '@microsoft/sp-webpart-base';

type DialogId = keyof DialogPropsMap;

interface DialogContextType {
    openDialog: <T extends DialogId>(dialogId: T, props?: Partial<DialogPropsMap[T]>) => void;
    closeDialog: () => void;
    openDialogId: DialogId | '';
    dialogProps: Partial<DialogPropsMap[DialogId]>;
}

interface DialogProviderProps {
    children: React.ReactNode;
    context: WebPartContext;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<DialogProviderProps> = ({ children, context }) => {
    const [openDialogId, setOpenDialogId] = useState<DialogId | ''>('');
    const [dialogProps, setDialogProps] = useState<Partial<DialogPropsMap[DialogId]>>({});


    const openDialog = <T extends DialogId>(id: T, props?: Partial<DialogPropsMap[T]>): void => {
        setOpenDialogId(id);
        setDialogProps(props || {});
    };

    const closeDialog = (): void => {
        setOpenDialogId('');
        setDialogProps({});
    };

    return (
        <DialogContext.Provider value={{ openDialog, closeDialog, openDialogId, dialogProps }}>
            {children}
            <DialogsManager
                openDialogId={openDialogId}
                dialogProps={dialogProps}
                context={context}
                onClose={closeDialog}
            />
        </DialogContext.Provider>
    );
};

export const useDialog = (): DialogContextType => {
    const ctx = useContext(DialogContext);
    if (!ctx) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return ctx;
};
