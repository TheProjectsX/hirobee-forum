import React, { useState } from "react";

interface DynamicInputProps {
    handleAddItem: () => void;
    handleUpdateRecord: (idx: number, value: any) => void;
    handleRemoveItem: (idx: number) => void;
    inputtedValues: any[];
    className?: string;
    addButtonLabel?: React.ReactNode | null;
    customAddButton?: React.ReactElement<any, any> | null;
    customInput?: React.ReactElement<
        React.InputHTMLAttributes<HTMLInputElement>
    > | null;
    customRemoveButton?: React.ReactElement<any, any>;
    addButtonDisabled?: boolean;
    removeButtonsDisabled?: boolean;
}

const DynamicInput = ({
    handleAddItem,
    handleUpdateRecord,
    handleRemoveItem,
    className = "",
    addButtonLabel = "Add More",
    customAddButton,
    customInput,
    customRemoveButton,
    inputtedValues,
    addButtonDisabled = false,
    removeButtonsDisabled = false,
}: DynamicInputProps) => {
    // Add More Button
    let AddButton = (
        <button
            onClick={() => handleAddItem()}
            className="text-sm px-4 py-2 rounded-sm bg-[dodgerBlue] hover:bg-blue-600 text-white disabled:bg-neutral-500 disabled:pointer-events-none"
            disabled={addButtonDisabled}
        >
            {addButtonLabel ?? "Add More"}
        </button>
    );
    if (customAddButton) {
        AddButton = React.cloneElement(customAddButton, {
            onClick: () => handleAddItem(),
            disabled: addButtonDisabled,
        });
    }

    // Input Area
    let InputArea = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
        <input type="text" {...props} className="border" />
    );

    if (customInput) {
        InputArea = (props: React.InputHTMLAttributes<HTMLInputElement>) =>
            React.cloneElement(customInput, { ...props });
    }

    // Remove Button
    let RemoveButton = (props: React.HTMLAttributes<HTMLElement>) => (
        <button
            {...props}
            className="rounded-full p-1 bg-slate-200 hover:text-red-600 disabled:pointer-events-none"
            disabled={removeButtonsDisabled}
        >
            <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path>
            </svg>
        </button>
    );
    if (customRemoveButton) {
        RemoveButton = (props: React.HTMLAttributes<HTMLElement>) =>
            React.cloneElement(customRemoveButton, {
                ...props,
                disabled: removeButtonsDisabled,
            });
    }

    return (
        <div className={`${className ?? ""}`} data-name="multiselect_wrapper">
            <div data-name="multiselect_inputs_wrapper" className="mb-4">
                {inputtedValues.map((value, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <InputArea
                            defaultValue={value}
                            onBlur={(e) =>
                                handleUpdateRecord(idx, e.target.value)
                            }
                        />
                        <RemoveButton onClick={() => handleRemoveItem(idx)} />
                    </div>
                ))}
            </div>

            {AddButton}
        </div>
    );
};

const useDynamicInput = ({
    defaultCount = 1,
    minItems = 0,
    maxItems = null,
}: {
    defaultCount?: number;
    minItems?: number;
    maxItems?: number | null;
} = {}) => {
    const [values, setValues] = useState<any[]>(
        new Array(defaultCount).fill("")
    );

    // Handle Add Value to Records
    const handleUpdateRecord = (idx: number, value: any) => {
        setValues((prev) =>
            prev.map((currentValue, currentIdx) =>
                currentIdx === idx ? value : currentValue
            )
        );
    };

    // Handle when Add More created
    const handleAddItem = () => {
        if (maxItems && values.length >= maxItems) return;
        setValues((prev) => [...prev, ""]);
    };

    // Handle Remove Item
    const handleRemoveItem = (idx: number) => {
        if (values.length <= minItems) return;

        setValues((prev) => prev.filter((_, currentIdx) => currentIdx !== idx));
    };

    const ControlledDynamicInput = (props: {
        className?: string;
        addButtonLabel?: React.ReactNode | null;
        customAddButton?: React.ReactElement<any, any> | null;
        customInput?: React.ReactElement<
            React.InputHTMLAttributes<HTMLInputElement>
        > | null;
    }) => (
        <DynamicInput
            handleAddItem={handleAddItem}
            handleUpdateRecord={handleUpdateRecord}
            handleRemoveItem={handleRemoveItem}
            inputtedValues={values}
            addButtonDisabled={!!maxItems && values.length >= maxItems}
            removeButtonsDisabled={values.length <= minItems}
            {...props}
        />
    );

    return {
        DynamicInput: ControlledDynamicInput,
        values,
        handleAddItem,
        handleRemoveItem,
    };
};

export default useDynamicInput;
