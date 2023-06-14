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
import uk.ac.bham.teamproject.domain.StudySession;
import uk.ac.bham.teamproject.repository.StudySessionRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.StudySession}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StudySessionResource {

    private final Logger log = LoggerFactory.getLogger(StudySessionResource.class);

    private static final String ENTITY_NAME = "studySession";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StudySessionRepository studySessionRepository;

    public StudySessionResource(StudySessionRepository studySessionRepository) {
        this.studySessionRepository = studySessionRepository;
    }

    /**
     * {@code POST  /study-sessions} : Create a new studySession.
     *
     * @param studySession the studySession to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new studySession, or with status {@code 400 (Bad Request)} if the studySession has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/study-sessions")
    public ResponseEntity<StudySession> createStudySession(@RequestBody StudySession studySession) throws URISyntaxException {
        log.debug("REST request to save StudySession : {}", studySession);
        if (studySession.getId() != null) {
            throw new BadRequestAlertException("A new studySession cannot already have an ID", ENTITY_NAME, "idexists");
        }
        StudySession result = studySessionRepository.save(studySession);
        return ResponseEntity
            .created(new URI("/api/study-sessions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /study-sessions/:id} : Updates an existing studySession.
     *
     * @param id the id of the studySession to save.
     * @param studySession the studySession to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated studySession,
     * or with status {@code 400 (Bad Request)} if the studySession is not valid,
     * or with status {@code 500 (Internal Server Error)} if the studySession couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/study-sessions/{id}")
    public ResponseEntity<StudySession> updateStudySession(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody StudySession studySession
    ) throws URISyntaxException {
        log.debug("REST request to update StudySession : {}, {}", id, studySession);
        if (studySession.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, studySession.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!studySessionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        StudySession result = studySessionRepository.save(studySession);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, studySession.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /study-sessions/:id} : Partial updates given fields of an existing studySession, field will ignore if it is null
     *
     * @param id the id of the studySession to save.
     * @param studySession the studySession to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated studySession,
     * or with status {@code 400 (Bad Request)} if the studySession is not valid,
     * or with status {@code 404 (Not Found)} if the studySession is not found,
     * or with status {@code 500 (Internal Server Error)} if the studySession couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/study-sessions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<StudySession> partialUpdateStudySession(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody StudySession studySession
    ) throws URISyntaxException {
        log.debug("REST request to partial update StudySession partially : {}, {}", id, studySession);
        if (studySession.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, studySession.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!studySessionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<StudySession> result = studySessionRepository
            .findById(studySession.getId())
            .map(existingStudySession -> {
                if (studySession.getActualStart() != null) {
                    existingStudySession.setActualStart(studySession.getActualStart());
                }
                if (studySession.getIsPrivate() != null) {
                    existingStudySession.setIsPrivate(studySession.getIsPrivate());
                }

                return existingStudySession;
            })
            .map(studySessionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, studySession.getId().toString())
        );
    }

    /**
     * {@code GET  /study-sessions} : get all the studySessions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of studySessions in body.
     */
    @GetMapping("/study-sessions")
    public ResponseEntity<List<StudySession>> getAllStudySessions() {
        log.debug("REST request to get all StudySessions");
        //        return studySessionRepository.findAll();
        List<StudySession> sessions = studySessionRepository.findJoin();
        return ResponseEntity.ok().body(sessions);
    }

    /**
     * {@code GET  /study-sessions/:id} : get the "id" studySession.
     *
     * @param id the id of the studySession to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the studySession, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/study-sessions/{id}")
    public ResponseEntity<StudySession> getStudySession(@PathVariable Long id) {
        log.debug("REST request to get StudySession : {}", id);
        Optional<StudySession> studySession = studySessionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(studySession);
    }

    /**
     * {@code DELETE  /study-sessions/:id} : delete the "id" studySession.
     *
     * @param id the id of the studySession to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/study-sessions/{id}")
    public ResponseEntity<Void> deleteStudySession(@PathVariable Long id) {
        log.debug("REST request to delete StudySession : {}", id);
        studySessionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/study-sessions/getPublic")
    public List<StudySession> getPublic() {
        log.debug("get public sessions");
        return studySessionRepository.getStudySesh();
    }

    @GetMapping("/study-sessions/getFriends")
    public StudySession getFriends(Long friendId) {
        log.debug("get friends session");
        return studySessionRepository.getFriendSession(friendId);
    }
}
