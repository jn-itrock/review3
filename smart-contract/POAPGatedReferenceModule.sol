// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import {IReferenceModule} from '@aave/lens-protocol/contracts/interfaces/IReferenceModule.sol';
import {ModuleBase} from '@aave/lens-protocol/contracts/core/modules/ModuleBase.sol';
import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {Errors} from '@aave/lens-protocol/contracts/libraries/Errors.sol';

interface IPOAP {
    /**
     * @dev Returns if `account` owns the required event POAP
     */
    function isEventMinter(uint256 eventId, address account) external view returns (bool);
}

/**
 * @notice A struct containing the necessary data to execute POAPGated references.
 *
 * @param poapAddress The address of ERC721 POAP used for gating the reference
 * @param eventId The eventId of the POAP required to execute a reference
 */
struct GateParams {
    address poapAddress;
    uint256 eventId;
}

/**
 * @title POAPGatedReferenceModule
 * @author Lens Protocol
 *
 * @notice A reference module that validates that the user who tries to reference has a required POAP.
 */
contract POAPGatedReferenceModule is ModuleBase, IReferenceModule {
    error CannotCommentWithoutPOAP();

    mapping(uint256 => mapping(uint256 => GateParams)) internal _gateParamsByPublicationByProfile;

    constructor(address hub) ModuleBase(hub) {}

    function initializeReferenceModule(
        uint256 profileId,
        uint256 pubId,
        bytes calldata data
    ) external override onlyHub returns (bytes memory) {
        GateParams memory gateParams = abi.decode(data, (GateParams));
        _gateParamsByPublicationByProfile[profileId][pubId] = gateParams;
        return data;
    }

    function processComment(
        uint256 profileId,
        uint256 profileIdPointed,
        uint256 pubIdPointed,
        bytes calldata data
    ) external view override onlyHub {
        _validateRequiredPoap(profileId, profileIdPointed, pubIdPointed);
    }

    function processMirror(
        uint256 profileId,
        uint256 profileIdPointed,
        uint256 pubIdPointed,
        bytes calldata data
    ) external view override onlyHub {
        _validateRequiredPoap(profileId, profileIdPointed, pubIdPointed);
    }

    function _validateRequiredPoap(
        uint256 profileId,
        uint256 profileIdPointed,
        uint256 pubIdPointed
    ) internal view {
        GateParams memory gateParams = _gateParamsByPublicationByProfile[profileIdPointed][
            pubIdPointed
        ];
        if (
            IPOAP(gateParams.poapAddress).isEventMinter(gateParams.eventId, IERC721(HUB).ownerOf(profileId))
        ) {
            revert CannotCommentWithoutPOAP();
        }
    }
}
