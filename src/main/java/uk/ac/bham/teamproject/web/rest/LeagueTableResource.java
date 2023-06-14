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
import uk.ac.bham.teamproject.domain.LeagueTable;
import uk.ac.bham.teamproject.repository.LeagueTableRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.LeagueTable}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LeagueTableResource {

    private final Logger log = LoggerFactory.getLogger(LeagueTableResource.class);

    private static final String ENTITY_NAME = "leagueTable";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LeagueTableRepository leagueTableRepository;

    public LeagueTableResource(LeagueTableRepository leagueTableRepository) {
        this.leagueTableRepository = leagueTableRepository;
    }

    /**
     * {@code POST  /league-tables} : Create a new leagueTable.
     *
     * @param leagueTable the leagueTable to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new leagueTable, or with status {@code 400 (Bad Request)} if the leagueTable has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/league-tables")
    public ResponseEntity<LeagueTable> createLeagueTable(@RequestBody LeagueTable leagueTable) throws URISyntaxException {
        log.debug("REST request to save LeagueTable : {}", leagueTable);
        if (leagueTable.getId() != null) {
            throw new BadRequestAlertException("A new leagueTable cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LeagueTable result = leagueTableRepository.save(leagueTable);
        return ResponseEntity
            .created(new URI("/api/league-tables/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /league-tables/:id} : Updates an existing leagueTable.
     *
     * @param id the id of the leagueTable to save.
     * @param leagueTable the leagueTable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated leagueTable,
     * or with status {@code 400 (Bad Request)} if the leagueTable is not valid,
     * or with status {@code 500 (Internal Server Error)} if the leagueTable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/league-tables/{id}")
    public ResponseEntity<LeagueTable> updateLeagueTable(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LeagueTable leagueTable
    ) throws URISyntaxException {
        log.debug("REST request to update LeagueTable : {}, {}", id, leagueTable);
        if (leagueTable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, leagueTable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!leagueTableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LeagueTable result = leagueTableRepository.save(leagueTable);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, leagueTable.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /league-tables/:id} : Partial updates given fields of an existing leagueTable, field will ignore if it is null
     *
     * @param id the id of the leagueTable to save.
     * @param leagueTable the leagueTable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated leagueTable,
     * or with status {@code 400 (Bad Request)} if the leagueTable is not valid,
     * or with status {@code 404 (Not Found)} if the leagueTable is not found,
     * or with status {@code 500 (Internal Server Error)} if the leagueTable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/league-tables/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LeagueTable> partialUpdateLeagueTable(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LeagueTable leagueTable
    ) throws URISyntaxException {
        log.debug("REST request to partial update LeagueTable partially : {}, {}", id, leagueTable);
        if (leagueTable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, leagueTable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!leagueTableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LeagueTable> result = leagueTableRepository
            .findById(leagueTable.getId())
            .map(existingLeagueTable -> {
                if (leagueTable.getName() != null) {
                    existingLeagueTable.setName(leagueTable.getName());
                }

                return existingLeagueTable;
            })
            .map(leagueTableRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, leagueTable.getId().toString())
        );
    }

    /**
     * {@code GET  /league-tables} : get all the leagueTables.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of leagueTables in body.
     */
    @GetMapping("/league-tables")
    public List<LeagueTable> getAllLeagueTables(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all LeagueTables");
        if (eagerload) {
            return leagueTableRepository.findAllWithEagerRelationships();
        } else {
            return leagueTableRepository.findAll();
        }
    }

    /**
     * {@code GET  /league-tables/:id} : get the "id" leagueTable.
     *
     * @param id the id of the leagueTable to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the leagueTable, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/league-tables/{id}")
    public ResponseEntity<LeagueTable> getLeagueTable(@PathVariable Long id) {
        log.debug("REST request to get LeagueTable : {}", id);
        Optional<LeagueTable> leagueTable = leagueTableRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(leagueTable);
    }

    /**
     * {@code DELETE  /league-tables/:id} : delete the "id" leagueTable.
     *
     * @param id the id of the leagueTable to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/league-tables/{id}")
    public ResponseEntity<Void> deleteLeagueTable(@PathVariable Long id) {
        log.debug("REST request to delete LeagueTable : {}", id);
        leagueTableRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
