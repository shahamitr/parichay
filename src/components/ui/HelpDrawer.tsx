'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, BookOpen, Shield, User } from 'lucide-react';
import { helpContent, ModuleHelp } from '@/data/help-content';
import { usePathname } from 'next/navigation';

interface HelpDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HelpDrawer({ isOpen, onClose }: HelpDrawerProps) {
    const pathname = usePathname();

    // Determine current module based on pathname
    const getModuleKey = (path: string): string => {
        if (path === '/dashboard') return 'dashboard';
        if (path.startsWith('/dashboard/brands')) return 'brands';
        if (path.startsWith('/dashboard/branches')) return 'branches';
        if (path.startsWith('/dashboard/leads')) return 'leads';
        if (path.startsWith('/dashboard/short-links')) return 'short-links';
        if (path.startsWith('/dashboard/social')) return 'social';
        if (path.startsWith('/dashboard/settings')) return 'settings';
        return 'dashboard'; // Default
    };

    const moduleKey = getModuleKey(pathname);
    const content: ModuleHelp = helpContent[moduleKey] || helpContent['dashboard'];

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-900 shadow-xl">
                                        <div className="px-4 py-6 sm:px-6 border-b border-gray-200 dark:border-gray-800">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                                        <BookOpen className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                                                            {content.title}
                                                        </Dialog.Title>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                            Help & Documentation
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="relative rounded-md bg-white dark:bg-gray-900 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        onClick={onClose}
                                                    >
                                                        <span className="absolute -inset-2.5" />
                                                        <span className="sr-only">Close panel</span>
                                                        <X className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                            <div className="mb-8">
                                                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                                    {content.description}
                                                </p>
                                            </div>

                                            <div className="space-y-8">
                                                {content.guides.map((guide, index) => (
                                                    <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            {guide.role === 'Admin' ? (
                                                                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                            ) : (
                                                                <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                            )}
                                                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                                                {guide.role} Guide
                                                            </h3>
                                                        </div>

                                                        <div className="space-y-6">
                                                            {guide.sections.map((section, sIndex) => (
                                                                <div key={sIndex}>
                                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                                                                        {section.title}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                                        {section.content}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
