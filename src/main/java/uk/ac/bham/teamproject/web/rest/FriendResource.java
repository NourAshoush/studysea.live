package uk.ac.bham.teamproject.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.Friend;
import uk.ac.bham.teamproject.domain.UserExtended;
import uk.ac.bham.teamproject.repository.FriendRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.Friend}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FriendResource {

    private final Logger log = LoggerFactory.getLogger(FriendResource.class);

    private static final String ENTITY_NAME = "friend";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FriendRepository friendRepository;

    public FriendResource(FriendRepository friendRepository) {
        this.friendRepository = friendRepository;
    }

    /**
     * {@code POST  /friends} : Create a new friend.
     *
     * @param friend the friend to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new friend, or with status {@code 400 (Bad Request)} if the friend has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/friends")
    public ResponseEntity<Friend> createFriend(@RequestBody Friend friend) throws URISyntaxException {
        log.debug("REST request to save Friend : {}", friend);
        if (friend.getId() != null) {
            throw new BadRequestAlertException("A new friend cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Friend result = friendRepository.save(friend);
        return ResponseEntity
            .created(new URI("/api/friends/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code POST  /friends/by-userx} : Create a new friend pair.
     *
     * @param friendPair A list of exactly two UserExtended objects.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new friend, or with status {@code 400 (Bad Request)} if the friend has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/friends/by-userx")
    public ResponseEntity<Friend> createFriend(@RequestBody List<UserExtended> friendPair) throws URISyntaxException {
        if (friendPair.size() != 2) {
            return ResponseEntity.badRequest().build();
        }

        UserExtended me = friendPair.get(0);
        UserExtended them = friendPair.get(1);

        Friend friendship = new Friend();

        friendship.setFriendshipFrom(me);
        friendship.setFriendshipTo(them);

        log.debug("REST request to save Friend : {}", friendship);
        Friend result = friendRepository.save(friendship);

        Friend friendship_reverse = new Friend();

        friendship_reverse.setFriendshipTo(me);
        friendship_reverse.setFriendshipFrom(them);

        log.debug("REST request to save Friend (reverse) : {}", friendship_reverse);
        friendRepository.save(friendship_reverse);

        return ResponseEntity
            .created(new URI("/api/friends/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /friends/:id} : Updates an existing friend.
     *
     * @param id the id of the friend to save.
     * @param friend the friend to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated friend,
     * or with status {@code 400 (Bad Request)} if the friend is not valid,
     * or with status {@code 500 (Internal Server Error)} if the friend couldn't be updated.
     */
    @PutMapping("/friends/{id}")
    public ResponseEntity<Friend> updateFriend(@PathVariable(value = "id", required = false) final Long id, @RequestBody Friend friend) {
        log.debug("REST request to update Friend : {}, {}", id, friend);
        if (friend.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, friend.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!friendRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Friend result = friendRepository.save(friend);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, friend.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /friends/:id} : Partial updates given fields of an existing friend, field will ignore if it is null
     *
     * @param id the id of the friend to save.
     * @param friend the friend to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated friend,
     * or with status {@code 400 (Bad Request)} if the friend is not valid,
     * or with status {@code 404 (Not Found)} if the friend is not found,
     * or with status {@code 500 (Internal Server Error)} if the friend couldn't be updated.
     */
    @PatchMapping(value = "/friends/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Friend> partialUpdateFriend(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Friend friend
    ) {
        log.debug("REST request to partial update Friend partially : {}, {}", id, friend);
        if (friend.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, friend.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!friendRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Friend> result = friendRepository.findById(friend.getId()).map(friendRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, friend.getId().toString())
        );
    }

    /**
     * {@code GET  /friends} : get all the friends.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of friends in body.
     */
    @GetMapping("/friends")
    public List<Friend> getAllFriends() {
        log.debug("REST request to get all Friends");
        return friendRepository.findAll();
    }

    /**
     * {@code GET  /friends/by-user/:id} : get the "id" friend.
     *
     * @param id the id of the user to find friends for.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the friend, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/friends/by-userx/{id}")
    public List<UserExtended> getFriendByUser(@PathVariable Long id) {
        log.debug("REST request to get Friend : {}", id);
        return friendRepository.friendsList(id);
    }

    /**
     * {@code DELETE  /friends/pair/:id/:id2} : delete the "id" friend.
     *
     * @param id the ids of the UserExtended corresponding to the friendship to delete.
     * @param id2 as above
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/friends/by-userx/{id}/{id2}")
    public ResponseEntity<Void> deleteFriendPair(@PathVariable Long id, @PathVariable Long id2) {
        log.debug("REST request to delete Friendship between : {} and {}", id, id2);
        friendRepository.deletePair(id, id2);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /friends/:id} : get the "id" friend.
     *
     * @param id the id of the friend to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the friend, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/friends/{id}")
    public ResponseEntity<Friend> getFriend(@PathVariable Long id) {
        log.debug("REST request to get Friend : {}", id);
        Optional<Friend> friend = friendRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(friend);
    }

    /**
     * {@code DELETE  /friends/:id} : delete the "id" friend.
     *
     * @param id the id of the friend to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/friends/{id}")
    public ResponseEntity<Void> deleteFriend(@PathVariable Long id) {
        log.debug("REST request to delete Friend : {}", id);
        friendRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
