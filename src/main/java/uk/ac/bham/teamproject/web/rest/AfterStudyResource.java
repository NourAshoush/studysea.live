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
import uk.ac.bham.teamproject.domain.AfterStudy;
import uk.ac.bham.teamproject.repository.AfterStudyRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.AfterStudy}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AfterStudyResource {

    private final Logger log = LoggerFactory.getLogger(AfterStudyResource.class);

    private static final String ENTITY_NAME = "afterStudy";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AfterStudyRepository afterStudyRepository;

    public AfterStudyResource(AfterStudyRepository afterStudyRepository) {
        this.afterStudyRepository = afterStudyRepository;
    }

    /**
     * {@code POST  /after-studies} : Create a new afterStudy.
     *
     * @param afterStudy the afterStudy to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new afterStudy, or with status {@code 400 (Bad Request)} if the afterStudy has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/after-studies")
    public ResponseEntity<AfterStudy> createAfterStudy(@RequestBody AfterStudy afterStudy) throws URISyntaxException {
        log.debug("REST request to save AfterStudy : {}", afterStudy);
        if (afterStudy.getId() != null) {
            throw new BadRequestAlertException("A new afterStudy cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AfterStudy result = afterStudyRepository.save(afterStudy);
        return ResponseEntity
            .created(new URI("/api/after-studies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /after-studies/:id} : Updates an existing afterStudy.
     *
     * @param id the id of the afterStudy to save.
     * @param afterStudy the afterStudy to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated afterStudy,
     * or with status {@code 400 (Bad Request)} if the afterStudy is not valid,
     * or with status {@code 500 (Internal Server Error)} if the afterStudy couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/after-studies/{id}")
    public ResponseEntity<AfterStudy> updateAfterStudy(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AfterStudy afterStudy
    ) throws URISyntaxException {
        log.debug("REST request to update AfterStudy : {}, {}", id, afterStudy);
        if (afterStudy.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, afterStudy.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!afterStudyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AfterStudy result = afterStudyRepository.save(afterStudy);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, afterStudy.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /after-studies/:id} : Partial updates given fields of an existing afterStudy, field will ignore if it is null
     *
     * @param id the id of the afterStudy to save.
     * @param afterStudy the afterStudy to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated afterStudy,
     * or with status {@code 400 (Bad Request)} if the afterStudy is not valid,
     * or with status {@code 404 (Not Found)} if the afterStudy is not found,
     * or with status {@code 500 (Internal Server Error)} if the afterStudy couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/after-studies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AfterStudy> partialUpdateAfterStudy(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AfterStudy afterStudy
    ) throws URISyntaxException {
        log.debug("REST request to partial update AfterStudy partially : {}, {}", id, afterStudy);
        if (afterStudy.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, afterStudy.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!afterStudyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AfterStudy> result = afterStudyRepository
            .findById(afterStudy.getId())
            .map(existingAfterStudy -> {
                if (afterStudy.getTimeSpent() != null) {
                    existingAfterStudy.setTimeSpent(afterStudy.getTimeSpent());
                }

                return existingAfterStudy;
            })
            .map(afterStudyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, afterStudy.getId().toString())
        );
    }

    /**
     * {@code GET  /after-studies} : get all the afterStudies.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of afterStudies in body.
     */
    @GetMapping("/after-studies")
    public List<AfterStudy> getAllAfterStudies() {
        log.debug("REST request to get all AfterStudies");
        return afterStudyRepository.findAll();
    }

    /**
     * {@code GET  /after-studies/:id} : get the "id" afterStudy.
     *
     * @param id the id of the afterStudy to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the afterStudy, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/after-studies/{id}")
    public ResponseEntity<AfterStudy> getAfterStudy(@PathVariable Long id) {
        log.debug("REST request to get AfterStudy : {}", id);
        Optional<AfterStudy> afterStudy = afterStudyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(afterStudy);
    }

    /**
     * {@code DELETE  /after-studies/:id} : delete the "id" afterStudy.
     *
     * @param id the id of the afterStudy to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/after-studies/{id}")
    public ResponseEntity<Void> deleteAfterStudy(@PathVariable Long id) {
        log.debug("REST request to delete AfterStudy : {}", id);
        afterStudyRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
