"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSourceForgeFiles = exports.isPasteOpen = exports.isPastebinUserList = exports.isGitLabRepo = exports.isBitBucketRepo = exports.isHistoryForFile = void 0;
const select = require("select-dom");
const github_url_detection_1 = require("github-url-detection");
const isHistoryForFile = () => (0, github_url_detection_1.isRepo)() && /^\/commits\/[0-9a-f]{5,40}\/.+/.test(github_url_detection_1.utils.getRepoPath());
exports.isHistoryForFile = isHistoryForFile;
/**
 * BitBucket related detections
 */
const isBitBucketRepo = () => location.href.indexOf('bitbucket.org/') > 0;
exports.isBitBucketRepo = isBitBucketRepo;
/**
 * GitLab related detections
 */
const isGitLabRepo = () => select.exists('.tree-content-holder');
exports.isGitLabRepo = isGitLabRepo;
/**
 * Pastebin related detections
 */
const isPastebinUserList = () => location.href.indexOf('pastebin.com/u/') > 0 && select.exists('table.maintable');
exports.isPastebinUserList = isPastebinUserList;
const isPasteOpen = () => select.exists('#code_frame2');
exports.isPasteOpen = isPasteOpen;
/**
 * SourceForge related detections
 */
const isSourceForgeFiles = () => select.exists('#files_list');
exports.isSourceForgeFiles = isSourceForgeFiles;
